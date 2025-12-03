#!/usr/bin/env node
"use strict";
const { Client } = require('pg');
(async () => {
  const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
  const client = new Client({ connectionString: dbUrl });
  await client.connect();
  const id = process.argv[2] || 'af640fec-6e41-4ecb-8f3c-0d8772e5930c';
  const r = await client.query('select compute_jitterbug_state($1::uuid) as state', [id]);
  console.log('state:', r.rows[0]);
  const rr = await client.query(`select count(*) filter (where category='crisis') as crisis_count, count(*) filter (where category='emotional') as emo_count, count(*) filter (where category in ('deep-pressure','tactile','proprioceptive')) as pos_count, sum(case when category='crisis' then 10 when category='emotional' then 3 when category in ('deep-pressure','tactile','proprioceptive') then 2 else 1 end) as total_weight from public.status_updates where tetrahedron_id=$1::uuid`, [id]);
  console.log('counts:', rr.rows[0]);
  await client.end();
})();
