Tetrahedron migrations and local test instructions

This folder contains Supabase migrations for the tetrahedron protocol: tables, policies, triggers, and functions.

Files:
- 20251202_000000_tetrahedron_schema.sql: Up migration that creates the tables, functions, policies, triggers, and indices.
- 20251202_000001_tetrahedron_schema_down.sql: Down migration to rollback the changes.

Local test and validation:

1) Start Supabase locally: (requires `supabase` CLI)

```pwsh
supabase start
```

2) Reset local db (optional) and apply migrations:

```pwsh
# Reset local database (dangerous) - use only for local dev
supabase db reset --confirm
# If using Supabase CLI migrations
supabase db push
```

If the Supabase CLI is not installed locally, there's a fallback script that applies the migration SQL directly and runs the test harness:

```pwsh
node scripts/test-migration-tetrahedron.cjs
```

3) Run the test harness to validate behavior:

```pwsh
# Run the migration test which includes seeding and several functional tests
node scripts/test-migration-tetrahedron.cjs
```

Notes & safety:
- This migration includes `SECURITY DEFINER` functions and trigger-based enforcement. For production, review function ownership and RLS settings.
- The recompute trigger skips tetrahedrons whose vertices don't map to `public.users` to avoid FK violations during mass recomputations.
- The validation trigger only runs on `vertices`, `hub_vertex_id`, or `hub_rotation_schedule` changes to avoid false-positives when only `next_action` or `jitterbug_state` is updated.

Security & Hardening recommendations:
- Limit `procedures` and triggers by owner role: use a dedicated DB role (not `postgres`) for `SECURITY DEFINER` functions.
- Revisit RLS policies to limit access to `protocol_settings` and `tetrahedron_actions` in production.
- Add audit logs for `tetrahedron` hub changes and `next_action` changes for traceability.

If you want, I can:
- Add a full CI job to run the `test-migration` script on PRs to validate changes.
- Harden policies further and create minimal required roles for the security-definer functions.
