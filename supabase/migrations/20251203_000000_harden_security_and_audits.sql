-- Migration: Harden RLS, set function ownership to app_service, add audits for tetrahedrons
BEGIN;

-- Create a dedicated role for service functions (no login) - adjust for production as needed
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_service') THEN
    CREATE ROLE app_service;
  END IF;
END
$$;

-- Grant execute privileges to app_service for the critical functions (fallback if change owner is not allowable)
GRANT EXECUTE ON FUNCTION public.compute_jitterbug_state(uuid) TO app_service;
GRANT EXECUTE ON FUNCTION public.compute_next_action(uuid) TO app_service;
GRANT EXECUTE ON FUNCTION public.set_next_action_and_log(uuid) TO app_service;
GRANT EXECUTE ON FUNCTION public.maybe_create_guardian_alert(uuid) TO app_service;
GRANT EXECUTE ON FUNCTION public.update_tetrahedron_state_on_status() TO app_service;
GRANT EXECUTE ON FUNCTION public.next_action_on_state_change() TO app_service;
GRANT EXECUTE ON FUNCTION public.enforce_tetrahedron_vertices_unique() TO app_service;
GRANT EXECUTE ON FUNCTION public.recompute_all_tetrahedron_states_and_actions() TO app_service;
GRANT EXECUTE ON FUNCTION public.deterministic_hub_vertex(text[], timestamptz) TO app_service;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO app_service;

-- Grant execute to app_service for public schema functions (so functions owned can call other functions)
GRANT USAGE ON SCHEMA public TO app_service;

-- Audit tables for tetrahedron hub & jitterbug state
CREATE TABLE IF NOT EXISTS public.tetrahedron_hub_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tetrahedron_id UUID REFERENCES public.tetrahedrons(id) NOT NULL,
  old_hub UUID,
  new_hub UUID,
  changed_by TEXT,
  reason TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.jitterbug_state_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tetrahedron_id UUID REFERENCES public.tetrahedrons(id) NOT NULL,
  old_state TEXT,
  new_state TEXT,
  changed_by TEXT,
  reason TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Owner the audit functions to app_service and create triggers
CREATE OR REPLACE FUNCTION public.log_tetrahedron_hub_change()
RETURNS TRIGGER AS $$
DECLARE
  actor TEXT := COALESCE(auth.uid()::TEXT, 'system');
BEGIN
  IF (OLD.hub_vertex_id IS DISTINCT FROM NEW.hub_vertex_id) THEN
    INSERT INTO public.tetrahedron_hub_history (tetrahedron_id, old_hub, new_hub, changed_by, changed_at)
    VALUES (NEW.id, OLD.hub_vertex_id, NEW.hub_vertex_id, actor, NOW());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.log_jitterbug_state_change()
RETURNS TRIGGER AS $$
DECLARE
  actor TEXT := COALESCE(auth.uid()::TEXT, 'system');
BEGIN
  IF (OLD.jitterbug_state IS DISTINCT FROM NEW.jitterbug_state) THEN
    INSERT INTO public.jitterbug_state_history (tetrahedron_id, old_state, new_state, changed_by, changed_at)
    VALUES (NEW.id, OLD.jitterbug_state, NEW.jitterbug_state, actor, NOW());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the triggers using owner app_service
DROP TRIGGER IF EXISTS tetra_hub_history_trigger ON public.tetrahedrons;
CREATE TRIGGER tetra_hub_history_trigger
AFTER UPDATE OF hub_vertex_id ON public.tetrahedrons
FOR EACH ROW EXECUTE FUNCTION public.log_tetrahedron_hub_change();

DROP TRIGGER IF EXISTS jitterbug_state_history_trigger ON public.tetrahedrons;
CREATE TRIGGER jitterbug_state_history_trigger
AFTER UPDATE OF jitterbug_state ON public.tetrahedrons
FOR EACH ROW EXECUTE FUNCTION public.log_jitterbug_state_change();

COMMIT;