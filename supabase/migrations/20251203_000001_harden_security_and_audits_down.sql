-- Rollback for security & audit migration
BEGIN;

-- Drop triggers and functions
DROP TRIGGER IF EXISTS tetra_hub_history_trigger ON public.tetrahedrons;
DROP FUNCTION IF EXISTS public.log_tetrahedron_hub_change();
DROP TRIGGER IF EXISTS jitterbug_state_history_trigger ON public.tetrahedrons;
DROP FUNCTION IF EXISTS public.log_jitterbug_state_change();

-- Drop audit tables
DROP TABLE IF EXISTS public.tetrahedron_hub_history CASCADE;
DROP TABLE IF EXISTS public.jitterbug_state_history CASCADE;

-- Reassign function owners back to postgres (best effort)
ALTER FUNCTION public.compute_jitterbug_state(uuid) OWNER TO postgres;
ALTER FUNCTION public.compute_next_action(uuid) OWNER TO postgres;
ALTER FUNCTION public.set_next_action_and_log(uuid) OWNER TO postgres;
ALTER FUNCTION public.maybe_create_guardian_alert(uuid) OWNER TO postgres;
ALTER FUNCTION public.update_tetrahedron_state_on_status() OWNER TO postgres;
ALTER FUNCTION public.next_action_on_state_change() OWNER TO postgres;
ALTER FUNCTION public.enforce_tetrahedron_vertices_unique() OWNER TO postgres;
ALTER FUNCTION public.recompute_all_tetrahedron_states_and_actions() OWNER TO postgres;
ALTER FUNCTION public.deterministic_hub_vertex(text[], timestamptz) OWNER TO postgres;
ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

-- Drop role if exists (note: may not be allowed on hosted DBs)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_service') THEN
    -- A safe attempt to drop; this may fail if role has objects or is used
    BEGIN
      DROP ROLE app_service;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Unable to drop role app_service; manual cleanup may be required';
    END;
  END IF;
END
$$;

COMMIT;
