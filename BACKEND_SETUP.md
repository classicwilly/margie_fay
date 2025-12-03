# Backend Setup Guide

## What Just Happened

You now have:
- ✅ Supabase client configured
- ✅ Database schema (6 tables with RLS policies)
- ✅ TypeScript types for database
- ✅ Hardhat config for smart contract deployment
- ✅ Deployment script for Memorial Fund + Governance DAOs
- ✅ API routes for tetrahedrons + Guardian monitoring

## Setup Steps

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy `.env.local.example` to `.env.local`
4. Add your Supabase URL and keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
5. In Supabase SQL Editor, run `supabase/schema.sql`

### 1.1 Tetrahedron Protocol Enforcement

We enforce the tetrahedron protocol at the database level to ensure data integrity across clients.

- The `tetrahedrons` table requires exactly 4 vertices and they must all be unique.
- This is enforced using a Postgres trigger (a `plpgsql` function) rather than a CHECK constraint with a subquery to support a broader range of Postgres versions and local Supabase.

Commands you can run locally:

```powershell
# Apply the full schema (may create tables fresh if the DB is empty)
npm run supabase:apply-schema

# Apply only the tetrahedron trigger (safe to run on existing DBs)
npm run supabase:apply-trigger

# Quick test harness to validate uniqueness & length constraints (uses service role key)
node scripts/test-tetrahedron.cjs
```

Notes:
- This is safer than a subquery-based CHECK (some Postgres versions reject subqueries in CHECKs).
- When deploying to production, use proper migrations and test on a staging environment before applying changes to your production DB.

### 1.2 Deterministic Hub Selection (Protocol-Driven)

- The tetrahedron protocol decides the hub. Arbitrary hub assignment is disallowed.
- If `hub_vertex_id` is omitted during insert/update, the database will set `hub_vertex_id` deterministically using `deterministic_hub_vertex(vertices, created_at)`, which picks the vertex with the lowest md5(vertex || created_at) value.
- If `hub_rotation_schedule` includes the current weekday, the hub will instead be the scheduled vertex for that day.
- If an explicit `hub_vertex_id` is supplied it must match the protocol-decided hub, otherwise the database rejects the change.

### 1.3 Automated Hub Rotation

- You can schedule or run a process to ensure `hub_vertex_id` reflects `hub_rotation_schedule` for weekdays.
- Example script `scripts/update-hubs-scheduled.cjs` will update current hubs for the present weekday using a database `UPDATE`.
- Add to a scheduler (cron or systemd timer on Linux, Task Scheduler on Windows, or a cloud cloud scheduler like GitHub Actions/Vercel Cron) to run this script daily to enforce scheduled hubs.

Example schedule (Windows Task Scheduler):

```powershell
# Run daily at 00:05
schtasks /Create /SC DAILY /TN "phnx_update_hubs" /TR "pwsh -Command \"cd C:\\Users\\sandra\\phenix-framework; npm run supabase:update-hubs-scheduled\"" /ST 00:05
```

Example schedule (Linux cron):

```bash
# Run daily at 00:05
5 0 * * * cd /path/to/phenix-framework && npm run supabase:update-hubs-scheduled
```

Use these helper commands locally:

```powershell
# Reapply trigger and helper function
npm run supabase:apply-trigger

# Validate hub behavior with tests
npm run supabase:test-tetrahedron
```

### 2. Smart Contract Deployment

**Testnet (Sepolia):**

1. Get Sepolia ETH from faucet: https://sepoliafaucet.com
2. Add to `.env.local`:
   ```
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
   DEPLOYER_PRIVATE_KEY=your_wallet_private_key
   ETHERSCAN_API_KEY=your_etherscan_key
   ```
3. Deploy:
   ```bash
   npx hardhat run scripts/deploy.ts --network sepolia
   ```
4. Copy contract addresses to `.env.local`

**Local Testing:**

```bash
# Terminal 1: Start local node
npx hardhat node

# Terminal 2: Deploy to local
npx hardhat run scripts/deploy.ts --network localhost
```

### 3. Guardian Node Setup

1. Add to `.env.local`:
   ```
   GUARDIAN_NODE_API_KEY=generate_a_secure_random_key
   ```

2. Set up cron job to hit monitoring endpoint every hour:
   ```bash
   # Using cURL
   curl -X POST http://localhost:3000/api/guardian/monitor \
     -H "x-guardian-api-key: your_key"
   ```

   Or use a service like Vercel Cron:
   ```json
   // vercel.json
   {
     "crons": [{
       "path": "/api/guardian/monitor",
       "schedule": "0 * * * *"
     }]
   }
   ```

### 4. Test It

**Create a tetrahedron:**

```bash
curl -X POST http://localhost:3000/api/tetrahedrons \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Health Squad Alpha",
    "domain": "health",
    "vertices": ["user_id_1", "user_id_2", "user_id_3", "user_id_4"]
  }'
```

**Get your tetrahedrons:**

```bash
curl http://localhost:3000/api/tetrahedrons
```

## What's Next

- [ ] Wire frontend components to real API (replace mock data)
- [ ] Add WebSocket/Supabase Realtime for live updates
- [ ] Connect Memorial Fund UI to smart contracts
- [ ] Build module docking UI (not just placeholders)
- [ ] Add payment processing (Stripe for fiat → Memorial Fund)
- [ ] Deploy Guardian Node as separate service (not just API route)
- [ ] Add mesh networking (peer-to-peer tetrahedron connections)

## Files Created

Backend Infrastructure:
- `lib/supabase/client.ts` - Supabase client
- `lib/supabase/database.types.ts` - TypeScript types
- `supabase/schema.sql` - Database schema (6 tables, RLS, indexes)

Smart Contracts:
- `hardhat.config.ts` - Hardhat configuration
- `scripts/deploy.ts` - Deployment script (upgradeable proxies)

API Routes:
- `app/api/tetrahedrons/route.ts` - GET/POST tetrahedrons
- `app/api/guardian/monitor/route.ts` - Guardian Node monitoring

Config:
- `.env.local.example` - Environment variables template

## Architecture

```
Frontend (Next.js)
    ↓
API Routes (app/api/*)
    ↓
Supabase (Database + Auth)
    ↓
Smart Contracts (Sepolia → Mainnet)
    ↓
Guardian Node (Monitoring Service)
```

**Data Flow:**

1. User creates tetrahedron → API → Supabase
2. User posts status → API → Supabase → Guardian monitors
3. Guardian detects issue → Creates alert → Supabase
4. Frontend polls/subscribes → Shows alert in real-time
5. User contributes to Memorial Fund → Smart Contract → API logs transaction

**Jitterbug State Management:**

- Frontend detects user activity patterns
- Guardian Node analyzes status updates
- Tetrahedron `jitterbug_state` updated in Supabase
- Real-time subscribers see state changes
- VPI Protocol activates on Negative Wye detection

## Status

✅ Database schema ready
✅ API routes operational
✅ Smart contract deployment scripts ready
🔲 Smart contracts deployed to testnet
🔲 Supabase project configured
🔲 Frontend wired to real API
🔲 Guardian Node running as service

**You're at:** Backend infrastructure coded, needs configuration + deployment.

**Next milestone:** Configure Supabase → Deploy contracts to testnet → Wire one tetrahedron end-to-end = working prototype.

### All decisions driven by math (the tetrahedron protocol)

We enforce protocol-driven decisions at the database layer so the system is deterministic, transparent, and resilient. No arbitrary or client-side-only settings are accepted.

- Hub selection: the `deterministic_hub_vertex` function deterministically picks the hub from `vertices` and `created_at`. If a `hub_rotation_schedule` exists it takes precedence for any weekday.
- Jitterbug state: `compute_jitterbug_state(tetrahedron_id)` computes a numeric score from recent status updates and decides `jitterbug_state` using deterministic thresholds (e.g., stressed vs stable vs positive). The database enforces this state — clients may not override it manually.
- Guardian alerts: `maybe_create_guardian_alert(tetrahedron_id)` computes alert severity from recent status weights and inserts `guardian_alerts` automatically when thresholds are exceeded.
- Rotation automation: a script (`scripts/update-hubs-scheduled.cjs`) can be scheduled (cron/Task Scheduler) to apply `hub_rotation_schedule` everyday; the DB applies the schedule deterministically.

Commands & tests

```powershell
# Re-apply triggers & functions
npm run supabase:apply-trigger

# Test deterministic hub + enforcement
npm run supabase:test-protocol-enforcement

# Test jitterbug behavior & state enforcement
npm run supabase:test-jitterbug

# Test guardian alert generation
npm run supabase:test-guardian-alerts

# Run scheduled hub updater
npm run supabase:update-hubs-scheduled
```

Security note

All enforcement functions are created with `SECURITY DEFINER` and are owned by the DB super-user when applied by local scripts. That allows triggers to bypass RLS and maintain global invariants, but it also requires care when migrating or deploying to production; only run schema changes under controlled, privileged DB credentials and use migrations for production updates.
