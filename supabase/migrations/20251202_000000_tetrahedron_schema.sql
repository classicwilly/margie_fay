-- Migration: Tetrahedron protocol schema
-- Up migration to create the tetrahedron schema, triggers, functions, policies, and indices

BEGIN;

-- Tables
CREATE TABLE IF NOT EXISTS public.tetrahedrons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT NOT NULL CHECK (domain IN ('health', 'education', 'work', 'family')),
  vertices TEXT[] NOT NULL CHECK (array_length(vertices, 1) = 4),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  jitterbug_state TEXT DEFAULT 'stable-delta' CHECK (jitterbug_state IN ('stable-delta', 'stressed-delta', 'positive-wye', 'hub-failure', 'negative-wye', 'reformation', 'new-delta')),
  next_action TEXT,
  hub_vertex_id UUID REFERENCES public.users(id),
  hub_rotation_schedule JSONB
);

CREATE TABLE IF NOT EXISTS public.status_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  tetrahedron_id UUID REFERENCES public.tetrahedrons(id) NOT NULL,
  status TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('oral', 'proprioceptive', 'vestibular', 'deep-pressure', 'tactile', 'emotional', 'crisis')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.guardian_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tetrahedron_id UUID REFERENCES public.tetrahedrons(id) NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('hub-stuck', 'jitterbug-failing', 'sensory-crisis', 'mesh-degrading')),
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  message TEXT NOT NULL,
  detected_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  resolved_at TIMESTAMPTZ,
  auto_resolved BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS public.modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tetrahedron_id UUID REFERENCES public.tetrahedrons(id) NOT NULL,
  module_type TEXT NOT NULL CHECK (module_type IN ('calendar', 'status', 'parenting', 'kids')),
  is_docked BOOLEAN DEFAULT TRUE,
  config JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.memorial_fund_contributions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contributor_address TEXT NOT NULL,
  amount TEXT NOT NULL,
  tetrahedron_id UUID REFERENCES public.tetrahedrons(id) NOT NULL,
  transaction_hash TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tetrahedron_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tetrahedron_id UUID REFERENCES public.tetrahedrons(id) NOT NULL,
  action TEXT NOT NULL,
  decided_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.protocol_settings (
  id TEXT PRIMARY KEY,
  value NUMERIC NOT NULL
);

-- Policies & RLS
ALTER TABLE public.tetrahedrons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardian_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memorial_fund_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tetrahedron_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.protocol_settings ENABLE ROW LEVEL SECURITY;

-- Users policies are expected to exist; keep minimal consistent RLS for others
-- Tetrahedrons: users can view/update tetrahedrons they're a vertex in
DROP POLICY IF EXISTS "Users can view their tetrahedrons" ON public.tetrahedrons;
CREATE POLICY "Users can view their tetrahedrons" ON public.tetrahedrons FOR SELECT
  USING (auth.uid()::TEXT = ANY(vertices));
DROP POLICY IF EXISTS "Users can update their tetrahedrons" ON public.tetrahedrons;
CREATE POLICY "Users can update their tetrahedrons" ON public.tetrahedrons FOR UPDATE
  USING (auth.uid()::TEXT = ANY(vertices));

-- Status updates policies
DROP POLICY IF EXISTS "Users can view status in their meshes" ON public.status_updates;
CREATE POLICY "Users can view status in their meshes" ON public.status_updates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tetrahedrons
      WHERE id = tetrahedron_id
      AND auth.uid()::TEXT = ANY(vertices)
    )
  );

DROP POLICY IF EXISTS "Users can create own status" ON public.status_updates;
CREATE POLICY "Users can create own status" ON public.status_updates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Guardian alerts
DROP POLICY IF EXISTS "Users can view alerts for their meshes" ON public.guardian_alerts;
CREATE POLICY "Users can view alerts for their meshes" ON public.guardian_alerts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tetrahedrons
      WHERE id = tetrahedron_id
      AND auth.uid()::TEXT = ANY(vertices)
    )
  );

-- Modules
DROP POLICY IF EXISTS "Users can view modules in their meshes" ON public.modules;
CREATE POLICY "Users can view modules in their meshes" ON public.modules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tetrahedrons
      WHERE id = tetrahedron_id
      AND auth.uid()::TEXT = ANY(vertices)
    )
  );
DROP POLICY IF EXISTS "Users can update modules in their meshes" ON public.modules;
CREATE POLICY "Users can update modules in their meshes" ON public.modules FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.tetrahedrons
      WHERE id = tetrahedron_id
      AND auth.uid()::TEXT = ANY(vertices)
    )
  );

-- Memorial Fund contributions (public select)
DROP POLICY IF EXISTS "Anyone can view contributions" ON public.memorial_fund_contributions;
CREATE POLICY "Anyone can view contributions" ON public.memorial_fund_contributions FOR SELECT
  USING (TRUE);

-- Actions: restrict insertion via service_role; keep select public for members or service_role
DROP POLICY IF EXISTS "Protocol can insert actions" ON public.tetrahedron_actions;
CREATE POLICY "Protocol can insert actions" ON public.tetrahedron_actions FOR INSERT WITH CHECK (auth.role() = 'service_role');
DROP POLICY IF EXISTS "Protocol can select actions" ON public.tetrahedron_actions;
CREATE POLICY "Protocol can select actions" ON public.tetrahedron_actions FOR SELECT USING (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM public.tetrahedrons WHERE id = tetrahedron_id AND auth.uid()::TEXT = ANY(vertices)));

-- Protocol settings: read open, write only to service role
DROP POLICY IF EXISTS "Protocol settings write" ON public.protocol_settings;
DROP POLICY IF EXISTS "Protocol settings read" ON public.protocol_settings;
DROP POLICY IF EXISTS "Protocol settings update" ON public.protocol_settings;
CREATE POLICY "Protocol settings read" ON public.protocol_settings FOR SELECT USING (true);
CREATE POLICY "Protocol settings write" ON public.protocol_settings FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Protocol settings update" ON public.protocol_settings FOR UPDATE USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Indices
CREATE INDEX IF NOT EXISTS idx_tetrahedrons_vertices ON public.tetrahedrons USING GIN(vertices);
CREATE INDEX IF NOT EXISTS idx_status_updates_tetrahedron ON public.status_updates(tetrahedron_id);
CREATE INDEX IF NOT EXISTS idx_status_updates_created ON public.status_updates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_guardian_alerts_tetrahedron ON public.guardian_alerts(tetrahedron_id);
CREATE INDEX IF NOT EXISTS idx_guardian_alerts_resolved ON public.guardian_alerts(resolved_at) WHERE resolved_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_modules_tetrahedron ON public.modules(tetrahedron_id);
CREATE INDEX IF NOT EXISTS idx_memorial_contributions_tetrahedron ON public.memorial_fund_contributions(tetrahedron_id);
CREATE INDEX IF NOT EXISTS idx_actions_tetrahedron ON public.tetrahedron_actions(tetrahedron_id);

-- Helper updated_at function & triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_tetrahedrons_updated_at ON public.tetrahedrons;
CREATE TRIGGER update_tetrahedrons_updated_at BEFORE UPDATE ON public.tetrahedrons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_modules_updated_at ON public.modules;
CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON public.modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Tetrahedron validation function
CREATE OR REPLACE FUNCTION public.deterministic_hub_vertex(vertices TEXT[], created_at TIMESTAMPTZ)
RETURNS TEXT AS $$
  SELECT v FROM (
    SELECT unnest(vertices) AS v, md5(unnest(vertices) || created_at::TEXT) AS h
    ORDER BY h ASC
    LIMIT 1
  ) t;
$$ LANGUAGE sql IMMUTABLE;

CREATE OR REPLACE FUNCTION public.enforce_tetrahedron_vertices_unique()
RETURNS TRIGGER AS $$
DECLARE
  rec_key TEXT;
  rec_val TEXT;
  expected_hub TEXT;
  deterministic_hub TEXT;
  created_at_ts TIMESTAMPTZ;
  computed_state TEXT;
BEGIN
  -- Ensure exactly four vertices
  IF array_length(NEW.vertices, 1) IS DISTINCT FROM 4 THEN
    RAISE EXCEPTION 'Tetrahedron must have exactly 4 vertices';
  END IF;

  -- Ensure vertices are unique
  IF EXISTS (
    SELECT 1
    FROM (
      SELECT unnest(NEW.vertices) AS v
    ) q
    GROUP BY v HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Tetrahedron vertices must be unique';
  END IF;

  -- Hub must be a vertex if provided
  IF NEW.hub_vertex_id IS NOT NULL AND NOT (NEW.hub_vertex_id::TEXT = ANY(NEW.vertices)) THEN
    RAISE EXCEPTION 'hub_vertex_id must be one of the vertices';
  END IF;

  -- hub_rotation_schedule validation: if provided, keys must be weekdays and values must be members of vertices
  IF NEW.hub_rotation_schedule IS NOT NULL THEN
    PERFORM jsonb_typeof(NEW.hub_rotation_schedule) = 'object'::TEXT;
    IF jsonb_typeof(NEW.hub_rotation_schedule) IS DISTINCT FROM 'object' THEN
      RAISE EXCEPTION 'hub_rotation_schedule must be a JSON object';
    END IF;

    FOR rec_key, rec_val IN SELECT key, value FROM jsonb_each_text(NEW.hub_rotation_schedule) LOOP
      IF NOT (rec_key IN ('monday','tuesday','wednesday','thursday','friday','saturday','sunday')) THEN
        RAISE EXCEPTION 'hub_rotation_schedule keys must be weekday names';
      END IF;
      IF NOT (rec_val = ANY(NEW.vertices)) THEN
        RAISE EXCEPTION 'hub_rotation_schedule values must be an existing vertex id';
      END IF;
    END LOOP;
  END IF;

  -- Determine deterministic hub
  created_at_ts := COALESCE(NEW.created_at, NOW());
  SELECT v INTO deterministic_hub FROM (
    SELECT unnest(NEW.vertices) AS v, md5(unnest(NEW.vertices) || created_at_ts::TEXT) AS h
    ORDER BY h ASC
    LIMIT 1
  ) t;

  -- If a rotation schedule exists and the current weekday is present use that as expected hub
  IF NEW.hub_rotation_schedule IS NOT NULL THEN
    DECLARE
      weekday TEXT := lower(trim(to_char(CURRENT_TIMESTAMP, 'Day')));
      scheduled_hub TEXT;
    BEGIN
      SELECT value INTO scheduled_hub FROM jsonb_each_text(NEW.hub_rotation_schedule) WHERE key = weekday;
      IF scheduled_hub IS NOT NULL THEN
        expected_hub := scheduled_hub;
      ELSE
        expected_hub := deterministic_hub;
      END IF;
    END;
  ELSE
    expected_hub := deterministic_hub;
  END IF;

  -- If no hub was provided, set the hub to the deterministic value decided by the protocol
  IF NEW.hub_vertex_id IS NULL THEN
    NEW.hub_vertex_id := expected_hub;
  ELSE
    IF NEW.hub_vertex_id::TEXT != expected_hub THEN
      RAISE EXCEPTION 'hub_vertex_id must be decided by protocol (expected %)', expected_hub;
    END IF;
  END IF;

  -- Enforce jitterbug_state to be computed deterministically by protocol
  computed_state := compute_jitterbug_state(NEW.id::uuid);
  IF NEW.jitterbug_state IS NULL OR NEW.jitterbug_state = '' THEN
    NEW.jitterbug_state := computed_state;
  ELSIF NEW.jitterbug_state != computed_state THEN
    RAISE EXCEPTION 'jitterbug_state must be determined by protocol (expected %)', computed_state;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS validate_tetrahedron_vertices ON public.tetrahedrons;
CREATE TRIGGER validate_tetrahedron_vertices
BEFORE INSERT OR UPDATE OF vertices, hub_vertex_id, hub_rotation_schedule ON public.tetrahedrons
FOR EACH ROW EXECUTE FUNCTION public.enforce_tetrahedron_vertices_unique();

-- Jitterbug state computation
CREATE OR REPLACE FUNCTION public.compute_jitterbug_state(tetrahedron_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  total_weight INT;
  pos_count INT;
  neg_count INT;
  w_crisis INT;
  w_emotional INT;
  w_positive INT;
  w_other INT;
  thr_stressed_weight INT;
  thr_stressed_neg INT;
  thr_positive_count INT;
  now_ts TIMESTAMPTZ := NOW();
  s RECORD;
BEGIN
  total_weight := 0;
  pos_count := 0;
  neg_count := 0;

  w_crisis := (SELECT COALESCE(value::int, 10) FROM public.protocol_settings WHERE id = 'weight_crisis');
  w_emotional := (SELECT COALESCE(value::int, 3) FROM public.protocol_settings WHERE id = 'weight_emotional');
  w_positive := (SELECT COALESCE(value::int, 2) FROM public.protocol_settings WHERE id = 'weight_positive');
  w_other := (SELECT COALESCE(value::int, 1) FROM public.protocol_settings WHERE id = 'weight_other');

  thr_stressed_weight := (SELECT COALESCE(value::int, 12) FROM public.protocol_settings WHERE id = 'threshold_stressed_weight');
  thr_stressed_neg := (SELECT COALESCE(value::int, 2) FROM public.protocol_settings WHERE id = 'threshold_stressed_neg_count');
  thr_positive_count := (SELECT COALESCE(value::int, 3) FROM public.protocol_settings WHERE id = 'threshold_positive_count');

  FOR s IN
    SELECT category FROM public.status_updates
    WHERE tetrahedron_id = tetrahedron_uuid
    AND created_at >= now_ts - INTERVAL '24 hours'
  LOOP
    IF s.category = 'crisis' THEN
      total_weight := total_weight + w_crisis;
      neg_count := neg_count + 1;
    ELSIF s.category = 'emotional' THEN
      total_weight := total_weight + w_emotional;
      neg_count := neg_count + 1;
    ELSIF s.category = 'deep-pressure' OR s.category = 'tactile' OR s.category = 'proprioceptive' THEN
      total_weight := total_weight + w_positive;
      pos_count := pos_count + 1;
    ELSE
      total_weight := total_weight + w_other;
    END IF;
  END LOOP;

  IF total_weight IS NULL OR total_weight = 0 THEN
    RETURN 'stable-delta';
  END IF;

  IF neg_count >= thr_stressed_neg OR total_weight >= thr_stressed_weight THEN
    RETURN 'stressed-delta';
  END IF;

  IF pos_count >= thr_positive_count THEN
    RETURN 'positive-wye';
  END IF;

  RETURN 'stable-delta';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Next action computation and update / logging
CREATE OR REPLACE FUNCTION public.compute_next_action(tetrahedron_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  state TEXT;
  sev_count INT;
  severe_exists BOOLEAN;
  scheduled_today TEXT;
  has_schedule BOOLEAN;
BEGIN
  state := compute_jitterbug_state(tetrahedron_uuid);

  SELECT count(*) INTO sev_count FROM public.guardian_alerts WHERE tetrahedron_id = tetrahedron_uuid AND severity = 'critical' AND resolved_at IS NULL;
  severe_exists := sev_count > 0;
  IF severe_exists THEN
    RETURN 'notify_emergency';
  END IF;

  IF state = 'stressed-delta' THEN
    RETURN 'suggest_calm_activity';
  END IF;

  IF state = 'positive-wye' THEN
    RETURN 'celebrate';
  END IF;

  SELECT (hub_rotation_schedule ->> lower(trim(to_char(CURRENT_TIMESTAMP,'Day')))) INTO scheduled_today FROM public.tetrahedrons WHERE id = tetrahedron_uuid;
  IF scheduled_today IS NOT NULL THEN
    RETURN 'rotate_hub';
  END IF;

  RETURN 'monitor';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.set_next_action_and_log(tetrahedron_uuid UUID)
RETURNS VOID AS $$
DECLARE
  action TEXT;
BEGIN
  action := compute_next_action(tetrahedron_uuid);
  UPDATE public.tetrahedrons SET next_action = action WHERE id = tetrahedron_uuid;
  INSERT INTO public.tetrahedron_actions (tetrahedron_id, action, decided_at)
  VALUES (tetrahedron_uuid, action, NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for state + actions
CREATE OR REPLACE FUNCTION public.update_tetrahedron_state_on_status()
RETURNS TRIGGER AS $$
DECLARE
  new_state TEXT;
BEGIN
  new_state := compute_jitterbug_state(NEW.tetrahedron_id);
  UPDATE public.tetrahedrons SET jitterbug_state = new_state WHERE id = NEW.tetrahedron_id;
  PERFORM maybe_create_guardian_alert(NEW.tetrahedron_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS state_update_trigger ON public.status_updates;
CREATE TRIGGER state_update_trigger
AFTER INSERT OR UPDATE ON public.status_updates
FOR EACH ROW EXECUTE FUNCTION public.update_tetrahedron_state_on_status();

-- Next action trigger
CREATE OR REPLACE FUNCTION public.next_action_on_state_change()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM public.set_next_action_and_log(NEW.id::uuid);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS next_action_trigger ON public.tetrahedrons;
CREATE TRIGGER next_action_trigger
AFTER INSERT OR UPDATE OF jitterbug_state, hub_rotation_schedule ON public.tetrahedrons
FOR EACH ROW EXECUTE FUNCTION public.next_action_on_state_change();

-- Guardian alert function
CREATE OR REPLACE FUNCTION public.maybe_create_guardian_alert(tetrahedron_uuid uuid)
RETURNS VOID AS $$
DECLARE
  total_weight INT := 0;
  now_ts TIMESTAMPTZ := NOW();
  v_alert_type TEXT := 'sensory-crisis';
  v_severity TEXT := 'info';
  v_msg TEXT := '';
  thr_warn INT;
  thr_critical INT;
BEGIN
  SELECT sum(case when category='crisis' then (SELECT COALESCE(value::int,10) FROM public.protocol_settings WHERE id='weight_crisis') when category='emotional' then (SELECT COALESCE(value::int,3) FROM public.protocol_settings WHERE id='weight_emotional') when category in ('deep-pressure','tactile','proprioceptive') then (SELECT COALESCE(value::int,2) FROM public.protocol_settings WHERE id='weight_positive') else (SELECT COALESCE(value::int,1) FROM public.protocol_settings WHERE id='weight_other') end) INTO total_weight
  FROM public.status_updates
  WHERE tetrahedron_id = tetrahedron_uuid
  AND created_at >= now_ts - INTERVAL '1 hour';
  IF total_weight IS NULL THEN total_weight := 0; END IF;
  thr_warn := (SELECT COALESCE(value::int,6) FROM public.protocol_settings WHERE id='threshold_alert_warning');
  thr_critical := (SELECT COALESCE(value::int,12) FROM public.protocol_settings WHERE id='threshold_alert_critical');
  IF total_weight >= thr_critical THEN
    v_severity := 'critical';
    v_msg := 'High sensory distress detected';
  ELSIF total_weight >= thr_warn THEN
    v_severity := 'warning';
    v_msg := 'Elevated sensory stress detected';
  ELSE
    RETURN;
  END IF;
  IF EXISTS(SELECT 1 FROM public.guardian_alerts WHERE tetrahedron_id = tetrahedron_uuid AND alert_type = v_alert_type AND severity = v_severity AND resolved_at IS NULL) THEN
    RETURN;
  END IF;
  INSERT INTO public.guardian_alerts (tetrahedron_id, alert_type, severity, message, detected_at) VALUES (tetrahedron_uuid, v_alert_type, v_severity, v_msg, now_ts);
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- recompute trigger for settings
CREATE OR REPLACE FUNCTION public.recompute_all_tetrahedron_states_and_actions()
RETURNS TRIGGER AS $$
DECLARE
  rec RECORD;
BEGIN
  -- Only recompute tetrahedrons whose vertices map to existing public.users entries
  FOR rec IN
    SELECT t.id FROM public.tetrahedrons t
    WHERE NOT EXISTS (
      SELECT 1 FROM unnest(t.vertices) v WHERE NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id::text = v)
    )
  LOOP
    PERFORM public.set_next_action_and_log(rec.id);
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS protocol_settings_change_trigger ON public.protocol_settings;
CREATE TRIGGER protocol_settings_change_trigger
AFTER INSERT OR UPDATE ON public.protocol_settings
FOR EACH STATEMENT
EXECUTE FUNCTION public.recompute_all_tetrahedron_states_and_actions();

COMMIT;
