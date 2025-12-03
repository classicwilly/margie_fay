-- Migration: Add SQL-based scheduled checker to create guardian alerts for missing mesh heartbeats
BEGIN;

-- Function: check_mesh_heartbeats_and_alert(threshold_minutes int)
CREATE OR REPLACE FUNCTION public.check_mesh_heartbeats_and_alert(threshold_minutes int)
RETURNS VOID AS $$
DECLARE
  older TIMESTAMPTZ := NOW() - (threshold_minutes || ' minutes')::INTERVAL;
  rec RECORD;
  v_msg TEXT;
BEGIN
  FOR rec IN
    SELECT id, last_heartbeat_at FROM public.tetrahedrons WHERE last_heartbeat_at IS NULL OR last_heartbeat_at < older
  LOOP
    IF rec.last_heartbeat_at IS NULL THEN
      v_msg := 'No heartbeat recorded for tetrahedron.';
    ELSE
      v_msg := 'Last heartbeat recorded at ' || rec.last_heartbeat_at::TEXT || '.';
    END IF;

    -- insert guardian_alert unless unresolved of same type exists
    IF NOT EXISTS (SELECT 1 FROM public.guardian_alerts WHERE tetrahedron_id = rec.id AND alert_type = 'mesh-degrading' AND resolved_at IS NULL) THEN
      INSERT INTO public.guardian_alerts (tetrahedron_id, alert_type, severity, message, detected_at, auto_resolved)
      VALUES (rec.id, 'mesh-degrading', 'warning', v_msg, NOW(), FALSE);
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute privilege for service role
GRANT EXECUTE ON FUNCTION public.check_mesh_heartbeats_and_alert(int) TO service_role;
GRANT EXECUTE ON FUNCTION public.check_mesh_heartbeats_and_alert(int) TO app_service;

COMMIT;
