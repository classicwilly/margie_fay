-- G.O.D. Database Schema
-- Supabase PostgreSQL

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Tetrahedrons table
CREATE TABLE public.tetrahedrons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT NOT NULL CHECK (domain IN ('health', 'education', 'work', 'family')),
  vertices TEXT[] NOT NULL CHECK (
    array_length(vertices, 1) = 4 /* uniqueness-check removed for local */
  ), -- 4 unique user IDs
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  jitterbug_state TEXT DEFAULT 'stable-delta' CHECK (jitterbug_state IN ('stable-delta', 'stressed-delta', 'positive-wye', 'hub-failure', 'negative-wye', 'reformation', 'new-delta')),
  hub_vertex_id UUID REFERENCES public.users(id), -- Current hub (null in Delta)
  hub_rotation_schedule JSONB -- { "monday": "user_id", "tuesday": "user_id", ... }
);

ALTER TABLE public.tetrahedrons ENABLE ROW LEVEL SECURITY;

-- Users can view tetrahedrons they're part of
CREATE POLICY "Users can view their tetrahedrons"
  ON public.tetrahedrons FOR SELECT
  USING (auth.uid()::TEXT = ANY(vertices));

-- Users can update tetrahedrons they're part of
CREATE POLICY "Users can update their tetrahedrons"
  ON public.tetrahedrons FOR UPDATE
  USING (auth.uid()::TEXT = ANY(vertices));

-- Status updates table
CREATE TABLE public.status_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  tetrahedron_id UUID REFERENCES public.tetrahedrons(id) NOT NULL,
  status TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('oral', 'proprioceptive', 'vestibular', 'deep-pressure', 'tactile', 'emotional', 'crisis')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.status_updates ENABLE ROW LEVEL SECURITY;

-- Users can view status updates in their tetrahedrons
CREATE POLICY "Users can view status in their meshes"
  ON public.status_updates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tetrahedrons
      WHERE id = tetrahedron_id
      AND auth.uid()::TEXT = ANY(vertices)
    )
  );

-- Users can create their own status updates
CREATE POLICY "Users can create own status"
  ON public.status_updates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Guardian alerts table
CREATE TABLE public.guardian_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tetrahedron_id UUID REFERENCES public.tetrahedrons(id) NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('hub-stuck', 'jitterbug-failing', 'sensory-crisis', 'mesh-degrading')),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  message TEXT NOT NULL,
  detected_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  resolved_at TIMESTAMPTZ,
  auto_resolved BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.guardian_alerts ENABLE ROW LEVEL SECURITY;

-- Users can view alerts for their tetrahedrons
CREATE POLICY "Users can view alerts for their meshes"
  ON public.guardian_alerts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tetrahedrons
      WHERE id = tetrahedron_id
      AND auth.uid()::TEXT = ANY(vertices)
    )
  );

-- Modules table
CREATE TABLE public.modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tetrahedron_id UUID REFERENCES public.tetrahedrons(id) NOT NULL,
  module_type TEXT NOT NULL CHECK (module_type IN ('calendar', 'status', 'parenting', 'kids')),
  is_docked BOOLEAN DEFAULT TRUE,
  config JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- Users can view modules for their tetrahedrons
CREATE POLICY "Users can view modules in their meshes"
  ON public.modules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tetrahedrons
      WHERE id = tetrahedron_id
      AND auth.uid()::TEXT = ANY(vertices)
    )
  );

-- Users can update modules for their tetrahedrons
CREATE POLICY "Users can update modules in their meshes"
  ON public.modules FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.tetrahedrons
      WHERE id = tetrahedron_id
      AND auth.uid()::TEXT = ANY(vertices)
    )
  );

-- Memorial Fund contributions table
CREATE TABLE public.memorial_fund_contributions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contributor_address TEXT NOT NULL,
  amount TEXT NOT NULL, -- Wei amount as string
  tetrahedron_id UUID REFERENCES public.tetrahedrons(id) NOT NULL,
  transaction_hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.memorial_fund_contributions ENABLE ROW LEVEL SECURITY;

-- Anyone can view contributions (public good)
CREATE POLICY "Anyone can view contributions"
  ON public.memorial_fund_contributions FOR SELECT
  USING (TRUE);

-- Create indexes for performance
CREATE INDEX idx_tetrahedrons_vertices ON public.tetrahedrons USING GIN(vertices);
CREATE INDEX idx_status_updates_tetrahedron ON public.status_updates(tetrahedron_id);
CREATE INDEX idx_status_updates_created ON public.status_updates(created_at DESC);
CREATE INDEX idx_guardian_alerts_tetrahedron ON public.guardian_alerts(tetrahedron_id);
CREATE INDEX idx_guardian_alerts_resolved ON public.guardian_alerts(resolved_at) WHERE resolved_at IS NULL;
CREATE INDEX idx_modules_tetrahedron ON public.modules(tetrahedron_id);
CREATE INDEX idx_memorial_contributions_tetrahedron ON public.memorial_fund_contributions(tetrahedron_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tetrahedrons_updated_at BEFORE UPDATE ON public.tetrahedrons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON public.modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
