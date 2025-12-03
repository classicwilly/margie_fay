-- Migration: Grant execute to service_role on critical protocol functions
BEGIN;

GRANT EXECUTE ON FUNCTION public.compute_jitterbug_state(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.compute_next_action(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.set_next_action_and_log(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.maybe_create_guardian_alert(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.update_tetrahedron_state_on_status() TO service_role;
GRANT EXECUTE ON FUNCTION public.next_action_on_state_change() TO service_role;
GRANT EXECUTE ON FUNCTION public.enforce_tetrahedron_vertices_unique() TO service_role;
GRANT EXECUTE ON FUNCTION public.recompute_all_tetrahedron_states_and_actions() TO service_role;
GRANT EXECUTE ON FUNCTION public.deterministic_hub_vertex(text[], timestamptz) TO service_role;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO service_role;

COMMIT;