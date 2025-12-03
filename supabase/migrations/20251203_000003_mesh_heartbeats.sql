-- Migration: Add mesh heartbeats logging table, last_heartbeat_on tetrahedrons, and record_mesh_heartbeat function
BEGIN;

-- Add last_heartbeat_at column to tetrahedrons
ALTER TABLE IF EXISTS public.tetrahedrons
  ADD COLUMN IF NOT EXISTS last_heartbeat_at TIMESTAMPTZ DEFAULT NULL;

-- Create table to log mesh heartbeats
CREATE TABLE IF NOT EXISTS public.mesh_heartbeats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tetrahedron_id UUID REFERENCES public.tetrahedrons(id) NOT NULL,
  source TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Security: function to record heartbeat, update tetrahedrons.last_heartbeat_at
CREATE OR REPLACE FUNCTION public.record_mesh_heartbeat(t_uuid UUID, src TEXT, payload JSONB)
RETURNS VOID AS $$
DECLARE
  actor TEXT := COALESCE(auth.uid()::TEXT, 'system');
BEGIN
  -- Insert heartbeat record
  INSERT INTO public.mesh_heartbeats (tetrahedron_id, source, payload, created_at)
  VALUES (t_uuid, src, payload, NOW());

  -- Update last_heartbeat_at on tetrahedrons
  UPDATE public.tetrahedrons SET last_heartbeat_at = NOW() WHERE id = t_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to service_role and a role for app_service (if present)
GRANT EXECUTE ON FUNCTION public.record_mesh_heartbeat(uuid, text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.record_mesh_heartbeat(uuid, text, jsonb) TO app_service;

-- RLS policy: Let service_role insert, and allow members (vertices) to insert
ALTER TABLE public.mesh_heartbeats ENABLE ROW LEVEL SECURITY;

-- Ensure not to duplicate policies on re-apply
DROP POLICY IF EXISTS "Service or vertex can insert heartbeat" ON public.mesh_heartbeats;
-- Allow service_role and vertices to insert
CREATE POLICY "Service or vertex can insert heartbeat" ON public.mesh_heartbeats
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role' OR EXISTS (
    SELECT 1 FROM public.tetrahedrons t WHERE t.id = mesh_heartbeats.tetrahedron_id AND auth.uid()::TEXT = ANY(t.vertices)
  ));

-- Allow vertices to select
DROP POLICY IF EXISTS "Vertex members can select heartbeats" ON public.mesh_heartbeats;
CREATE POLICY "Vertex members can select heartbeats" ON public.mesh_heartbeats
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.tetrahedrons t WHERE t.id = mesh_heartbeats.tetrahedron_id AND auth.uid()::TEXT = ANY(t.vertices)
  ));

COMMIT;
