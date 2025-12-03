#!/usr/bin/env node
"use strict";
const { Client } = require('pg');
(async () => {
  const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
  const client = new Client({ connectionString: dbUrl });
  await client.connect();
  const res = await client.query(`
    SELECT n.nspname as schema, p.proname as function, pg_get_function_identity_arguments(p.oid) as args
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE p.proname IN ('compute_jitterbug_state', 'deterministic_hub_vertex', 'enforce_tetrahedron_vertices_unique');
  `);
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
})();
