#!/usr/bin/env node
"use strict";

const { Client } = require('pg');

const defaults = [
  // weights
  { id: 'weight_crisis', value: 10 },
  { id: 'weight_emotional', value: 3 },
  { id: 'weight_positive', value: 2 },
  { id: 'weight_other', value: 1 },
  // thresholds
  { id: 'threshold_stressed_weight', value: 12 },
  { id: 'threshold_stressed_neg_count', value: 2 },
  { id: 'threshold_positive_count', value: 3 },
  { id: 'threshold_alert_warning', value: 6 },
  { id: 'threshold_alert_critical', value: 12 }
];

async function main() {
  const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
  const client = new Client({ connectionString: dbUrl });
  await client.connect();
  try {
    await client.query('BEGIN');
    for (const row of defaults) {
      await client.query("INSERT INTO public.protocol_settings (id, value) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value", [row.id, row.value]);
    }
    await client.query('COMMIT');
    console.log('protocol settings seeded');
  } catch (err) {
    console.error('error seeding settings', err.message || err);
    try { await client.query('ROLLBACK'); } catch (e) {}
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
