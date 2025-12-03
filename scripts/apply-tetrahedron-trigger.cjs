#!/usr/bin/env node
"use strict";

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function main() {
  const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
  const client = new Client({ connectionString: dbUrl });
  const sql = `
DROP TRIGGER IF EXISTS validate_tetrahedron_vertices ON public.tetrahedrons;

CREATE OR REPLACE FUNCTION enforce_tetrahedron_vertices_unique()
RETURNS TRIGGER AS $$
DECLARE
  rec_key TEXT;
  rec_val TEXT;
  expected_hub TEXT;
  deterministic_hub TEXT;
  created_at_ts TIMESTAMPTZ;
  computed_state TEXT;
BEGIN
  IF array_length(NEW.vertices, 1) IS DISTINCT FROM 4 THEN
    RAISE EXCEPTION 'Tetrahedron must have exactly 4 vertices';
  END IF;

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

  -- Determine deterministic hub, based on the md5 of vertex id + created_at to pick a stable vertex
  created_at_ts := COALESCE(NEW.created_at, NOW());
  SELECT deterministic_hub_vertex(NEW.vertices, created_at_ts) INTO deterministic_hub;

  -- If a rotation schedule exists for today, use it
  IF NEW.hub_rotation_schedule IS NOT NULL THEN
    DECLARE
      weekday TEXT := lower(trim(to_char(CURRENT_TIMESTAMP, 'Day')));
      scheduled_hub TEXT;
    BEGIN
      SELECT value INTO scheduled_hub FROM jsonb_each_text(NEW.hub_rotation_schedule) WHERE key = weekday;
      IF scheduled_hub IS NOT NULL THEN expected_hub := scheduled_hub; ELSE expected_hub := deterministic_hub; END IF;
    END;
  ELSE
    expected_hub := deterministic_hub;
  END IF;

  -- Set or enforce hub according to expected hub
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

  CREATE TRIGGER validate_tetrahedron_vertices
BEFORE INSERT OR UPDATE ON public.tetrahedrons
FOR EACH ROW EXECUTE FUNCTION enforce_tetrahedron_vertices_unique();
  
-- Create compute_jitterbug_state function
CREATE OR REPLACE FUNCTION compute_jitterbug_state(tetrahedron_uuid uuid)
RETURNS text AS $$
DECLARE
  total_weight INT := 0;
  pos_count INT := 0;
  neg_count INT := 0;
  s RECORD;
  now_ts TIMESTAMPTZ := NOW();
BEGIN
  FOR s IN
    SELECT category FROM public.status_updates
    WHERE tetrahedron_id = tetrahedron_uuid
    AND created_at >= now_ts - INTERVAL '24 hours'
  LOOP
    IF s.category = 'crisis' THEN
      total_weight := total_weight + 10; neg_count := neg_count + 1;
    ELSIF s.category = 'emotional' THEN
      total_weight := total_weight + 3; neg_count := neg_count + 1;
    ELSIF s.category = 'deep-pressure' OR s.category = 'tactile' OR s.category = 'proprioceptive' THEN
      total_weight := total_weight + 2; pos_count := pos_count + 1;
    ELSE
      total_weight := total_weight + 1;
    END IF;
  END LOOP;
  IF total_weight IS NULL OR total_weight = 0 THEN RETURN 'stable-delta'; END IF;
  IF neg_count >= 2 OR total_weight >= 12 THEN RETURN 'stressed-delta'; END IF;
  IF pos_count >= 3 THEN RETURN 'positive-wye'; END IF;
  RETURN 'stable-delta';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_tetrahedron_state_on_status()
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
FOR EACH ROW EXECUTE FUNCTION update_tetrahedron_state_on_status();

-- Create compute_next_action and set_next_action_and_log with triggers
CREATE OR REPLACE FUNCTION compute_next_action(tetrahedron_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  state TEXT;
  sev_count INT;
  scheduled_today TEXT;
BEGIN
  state := compute_jitterbug_state(tetrahedron_uuid);
  SELECT count(*) INTO sev_count FROM public.guardian_alerts WHERE tetrahedron_id = tetrahedron_uuid AND severity = 'critical' AND resolved_at IS NULL;
  IF sev_count > 0 THEN
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

CREATE OR REPLACE FUNCTION set_next_action_and_log(tetrahedron_uuid UUID)
RETURNS VOID AS $$
DECLARE
  action TEXT;
BEGIN
  action := compute_next_action(tetrahedron_uuid);
  UPDATE public.tetrahedrons SET next_action = action WHERE id = tetrahedron_uuid;
  INSERT INTO public.tetrahedron_actions (tetrahedron_id, action, decided_at) VALUES (tetrahedron_uuid, action, NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS next_action_trigger ON public.tetrahedrons;
CREATE OR REPLACE FUNCTION next_action_on_state_change()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM set_next_action_and_log(NEW.id::uuid);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER next_action_trigger
AFTER INSERT OR UPDATE OF jitterbug_state, hub_rotation_schedule ON public.tetrahedrons
FOR EACH ROW EXECUTE FUNCTION next_action_on_state_change();

-- Recompute all tetrahedrons when protocol settings change
CREATE OR REPLACE FUNCTION recompute_all_tetrahedron_states_and_actions()
RETURNS TRIGGER AS $$
DECLARE
  rec RECORD;
BEGIN
  -- Only recompute for tetrahedrons whose vertices map to real users (avoid FK errors)
  FOR rec IN SELECT id FROM public.tetrahedrons t
    WHERE NOT EXISTS (
      SELECT 1 FROM (SELECT unnest(t.vertices) AS v) vv
      WHERE NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id::text = vv.v)
    ) LOOP
    PERFORM set_next_action_and_log(rec.id);
  END LOOP;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS protocol_settings_change_trigger ON public.protocol_settings;
CREATE TRIGGER protocol_settings_change_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.protocol_settings
FOR EACH STATEMENT EXECUTE FUNCTION recompute_all_tetrahedron_states_and_actions();

-- Create guardian alert function which may insert alerts depending on the recent status weights
CREATE OR REPLACE FUNCTION maybe_create_guardian_alert(tetrahedron_uuid uuid)
RETURNS VOID AS $$
DECLARE
  total_weight INT := 0;
  now_ts TIMESTAMPTZ := NOW();
  v_alert_type TEXT := 'sensory-crisis';
  v_severity TEXT := 'info';
  v_msg TEXT := '';
BEGIN
  SELECT sum(case when category='crisis' then 10 when category='emotional' then 3 when category in ('deep-pressure','tactile','proprioceptive') then 2 else 1 end) INTO total_weight
  FROM public.status_updates
  WHERE tetrahedron_id = tetrahedron_uuid
  AND created_at >= now_ts - INTERVAL '1 hour';
  IF total_weight IS NULL THEN total_weight := 0; END IF;
  IF total_weight >= 12 THEN
    v_severity := 'critical';
    v_msg := 'High sensory distress detected';
  ELSIF total_weight >= 6 THEN
    v_severity := 'warning';
    v_msg := 'Elevated sensory stress detected';
  ELSE
    RETURN; -- no alert necessary
  END IF;
  -- avoid duplicate active alerts of same type+severity
  IF EXISTS(SELECT 1 FROM public.guardian_alerts WHERE tetrahedron_id = tetrahedron_uuid AND alert_type = v_alert_type AND severity = v_severity AND resolved_at IS NULL) THEN
    RETURN;
  END IF;
  INSERT INTO public.guardian_alerts (tetrahedron_id, alert_type, severity, message, detected_at) VALUES (tetrahedron_uuid, v_alert_type, v_severity, v_msg, now_ts);
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
  
-- Ensure deterministic helper is present (required for rpc/clients)
CREATE OR REPLACE FUNCTION deterministic_hub_vertex(vertices TEXT[], created_at TIMESTAMPTZ)
RETURNS TEXT AS $$
  SELECT v FROM (
    SELECT unnest(vertices) AS v, md5(unnest(vertices) || created_at::TEXT) AS h
    ORDER BY h ASC
    LIMIT 1
  ) t;
$$ LANGUAGE sql IMMUTABLE;
`;

  try {
    await client.connect();
    console.log('Connected to DB at', dbUrl);
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('Tetrahedron trigger applied successfully.');
  } catch (err) {
    console.error('Error applying trigger:', err.message || err);
    try { await client.query('ROLLBACK'); } catch(e){}
    process.exit(2);
  } finally {
    await client.end();
  }
}

main();

