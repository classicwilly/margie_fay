# Mesh Heartbeat

This document explains the mesh health monitoring primitives introduced in `supabase/migrations/20251203_000003_mesh_heartbeats.sql`.

What we added:

- `mesh_heartbeats` table: logs heartbeats from clients or service_role with `tetrahedron_id`, `source`, `payload`, and `created_at`.
- `last_heartbeat_at` column on `tetrahedrons` to keep the last time the mesh received a heartbeat for that tetrahedron.
- `record_mesh_heartbeat(t_uuid uuid, src text, payload jsonb)` RPC function (SECURITY DEFINER) which writes to `mesh_heartbeats` and updates `last_heartbeat_at`.
- RLS policies so that `service_role` or vertices in the tetrahedron can insert/ select heartbeats.

Basic queries:

- Get recent heartbeats for a tetrahedron:

```sql
SELECT * FROM public.mesh_heartbeats WHERE tetrahedron_id = '<TETRA_ID>' ORDER BY created_at DESC LIMIT 10;
```

- Check last heartbeat on tetrahedron:

```sql
SELECT id, name, last_heartbeat_at FROM public.tetrahedrons WHERE id = '<TETRA_ID>';
```

- Use the RPC (via supabase-js):

```js
const { data, error } = await supService.rpc('record_mesh_heartbeat', { t_uuid: tetraId, src: 'device-abc', payload: { ping: true } });
```

Monitoring & Alerts:

You can add an external monitor that queries `last_heartbeat_at` and triggers an alert (Guardian Node/Alert) if a tetrahedron hasn't received a heartbeat for a configured threshold.

Example: Check for heartbeat older than 1 hour:

```sql
SELECT id, name, last_heartbeat_at
FROM public.tetrahedrons
WHERE last_heartbeat_at IS NULL OR last_heartbeat_at < NOW() - INTERVAL '1 hour';
```

Recommended next steps:

- Add a scheduled job (external cron or a Supabase scheduled function) that runs the query above and writes a guardian alert if a tetrahedron is missing a heartbeat for a defined threshold.
- Add a small CLI or monitoring endpoint to report mesh health metrics for observability (e.g., Prometheus metrics: heartbeats per minute per tetrahedron).
If you want, I can add: a scheduled SQL function, or a Node script + Cron job that writes to `guardian_alerts` when heartbeats are missing.

We added a Node monitor script: `scripts/monitor-mesh-health.cjs` that finds tetrahedrons missing heartbeats (older than threshold) and creates `guardian_alerts` of type `mesh-degrading`.
You can run it manually as `node scripts/monitor-mesh-health.cjs --threshold-minutes 60` to find tetrahedrons with no heartbeat in the last hour, or `--threshold-minutes 0 --tetrahedron-id <id>` in tests.
A simple test harness exists: `scripts/test-monitor-mesh-health.cjs` that validates monitor behavior and idempotency (no duplicate alerts on repeated runs).

SQL-based checker and scheduling
--------------------------------

We added a SQL function `public.check_mesh_heartbeats_and_alert(int)` exposed via RPC and able to be scheduled when a DB scheduler is available. Use the Node RPC wrapper `scripts/monitor-mesh-health-sql.cjs` if you prefer invoking the function from a scheduler instead of scanning in Node.

How to schedule with `pg_cron`: (only if you have the extension installed and enabled on your Postgres/Supabase DB):

```sql
-- Example: schedule to run every hour
SELECT cron.schedule('check_mesh_heartbeats_hourly', '0 * * * *', $$SELECT public.check_mesh_heartbeats_and_alert(60);$$);
```

Or schedule a server/cloud cron to run the Node RPC wrapper periodically:

```bash
# run every 5 minutes (cron)
node scripts/monitor-mesh-health-sql.cjs --threshold-minutes 60
```
