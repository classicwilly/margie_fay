-- Rollback for tetrahedron migration
BEGIN;

-- Drop triggers
DROP TRIGGER IF EXISTS protocol_settings_change_trigger ON public.protocol_settings;
DROP FUNCTION IF EXISTS public.recompute_all_tetrahedron_states_and_actions();

DROP TRIGGER IF EXISTS next_action_trigger ON public.tetrahedrons;
DROP FUNCTION IF EXISTS public.next_action_on_state_change();

DROP TRIGGER IF EXISTS state_update_trigger ON public.status_updates;
DROP FUNCTION IF EXISTS public.update_tetrahedron_state_on_status();

DROP TRIGGER IF EXISTS validate_tetrahedron_vertices ON public.tetrahedrons;
DROP FUNCTION IF EXISTS public.enforce_tetrahedron_vertices_unique();

-- Drop functions
DROP FUNCTION IF EXISTS public.maybe_create_guardian_alert(uuid);
DROP FUNCTION IF EXISTS public.set_next_action_and_log(uuid);
DROP FUNCTION IF EXISTS public.compute_next_action(uuid);
DROP FUNCTION IF EXISTS public.compute_jitterbug_state(uuid);
DROP FUNCTION IF EXISTS public.deterministic_hub_vertex(text[], timestamptz);
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Drop indexes
DROP INDEX IF EXISTS idx_tetrahedrons_vertices;
DROP INDEX IF EXISTS idx_status_updates_tetrahedron;
DROP INDEX IF EXISTS idx_status_updates_created;
DROP INDEX IF EXISTS idx_guardian_alerts_tetrahedron;
DROP INDEX IF EXISTS idx_guardian_alerts_resolved;
DROP INDEX IF EXISTS idx_modules_tetrahedron;
DROP INDEX IF EXISTS idx_memorial_contributions_tetrahedron;
DROP INDEX IF EXISTS idx_actions_tetrahedron;

-- Drop policies
DROP POLICY IF EXISTS "Protocol settings write" ON public.protocol_settings;
DROP POLICY IF EXISTS "Protocol settings update" ON public.protocol_settings;
DROP POLICY IF EXISTS "Protocol settings read" ON public.protocol_settings;
DROP POLICY IF EXISTS "Protocol can select actions" ON public.tetrahedron_actions;
DROP POLICY IF EXISTS "Protocol can insert actions" ON public.tetrahedron_actions;
DROP POLICY IF EXISTS "Anyone can view contributions" ON public.memorial_fund_contributions;
DROP POLICY IF EXISTS "Users can update modules in their meshes" ON public.modules;
DROP POLICY IF EXISTS "Users can view modules in their meshes" ON public.modules;
DROP POLICY IF EXISTS "Users can view alerts for their meshes" ON public.guardian_alerts;
DROP POLICY IF EXISTS "Users can create own status" ON public.status_updates;
DROP POLICY IF EXISTS "Users can view status in their meshes" ON public.status_updates;
DROP POLICY IF EXISTS "Users can update their tetrahedrons" ON public.tetrahedrons;
DROP POLICY IF EXISTS "Users can view their tetrahedrons" ON public.tetrahedrons;

-- Drop tables
DROP TABLE IF EXISTS public.protocol_settings CASCADE;
DROP TABLE IF EXISTS public.tetrahedron_actions CASCADE;
DROP TABLE IF EXISTS public.memorial_fund_contributions CASCADE;
DROP TABLE IF EXISTS public.modules CASCADE;
DROP TABLE IF EXISTS public.guardian_alerts CASCADE;
DROP TABLE IF EXISTS public.status_updates CASCADE;
DROP TABLE IF EXISTS public.tetrahedrons CASCADE;

COMMIT;
