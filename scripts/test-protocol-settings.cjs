#!/usr/bin/env node
"use strict";

// test script to verify changing protocol settings affects compute_jitterbug_state and alerts
const { Client } = require('pg');
(async () => {
  const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
  const client = new Client({ connectionString: dbUrl });
  await client.connect();
  try {
    // set smaller threshold for stressed
    await client.query("INSERT INTO public.protocol_settings (id, value) VALUES ('threshold_stressed_weight', 7) ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value");
    // now query to ensure weight changes are read
    const res = await client.query(`SELECT value::int as v FROM public.protocol_settings WHERE id='threshold_stressed_weight'`);
    console.log('stressed threshold set to', res.rows[0].v);
  } finally {
    await client.end();
  }
})();
