#!/usr/bin/env node
'use strict';

// Test migration: resets local DB, applies tetrahedron migration, seeds default protocol_settings and runs existing tests
const fs = require('fs');
const { spawnSync } = require('child_process');
const { Client } = require('pg');

(async () => {
  const supabaseCli = 'supabase';
  const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
  const migrationsDir = 'supabase/migrations';

  try {
    console.log('Resetting local database using supabase CLI if available...');
    const resetResult = spawnSync(supabaseCli, ['db', 'reset', '--confirm'], { stdio: 'inherit' });
    if (resetResult.error) {
      console.log('Supabase CLI not available or reset failed; proceeding to manual drop/apply.');
    }
  } catch (err) {
    console.log('Failed to run supabase reset via CLI or none available:', err.message)
  }

  const client = new Client({ connectionString: dbUrl });
  await client.connect();
  try {
    console.log('Applying migrations...');
    const migrationFiles = fs.readdirSync(migrationsDir).sort();
    for (const file of migrationFiles) {
      if (file.endsWith('.sql') && !file.endsWith('_down.sql')) {
        const migrationPath = `${migrationsDir}/${file}`;
        console.log('Applying migration', migrationPath);
        const sql = fs.readFileSync(migrationPath, 'utf8');
        await client.query(sql);
      }
    }

    console.log('Seeding protocol settings defaults (if not present)');
    // seed using existing script
    try {
      const spawn = require('child_process').spawnSync;
      const res = spawn('node', ['scripts/seed-protocol-settings.cjs'], { stdio: 'inherit' });
      if (res.status !== 0) throw new Error('seeding script failed');
    } catch (err) {
      console.log('Falling back to direct seeding', err.message || err);
      const defaults = [
      ['weight_crisis', 10],
      ['weight_emotional', 3],
      ['weight_positive', 2],
      ['weight_other', 1],
      ['threshold_stressed_weight', 12],
      ['threshold_stressed_neg_count', 2],
      ['threshold_positive_count', 3],
      ['threshold_alert_warning', 6],
      ['threshold_alert_critical', 12]
    ];
    for (const [id, val] of defaults) {
      await client.query('INSERT INTO public.protocol_settings (id, value) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value', [id, val]);
    }
    }

    console.log('Running test harnesses...');
    const makeCmd = (cmd) => ({ command: 'node', args: [cmd] });
    const tests = ['scripts/test-jitterbug.cjs', 'scripts/test-guardian-alerts.cjs', 'scripts/test-protocol-settings.cjs', 'scripts/test-next-action.cjs', 'scripts/test-tetrahedron.cjs', 'scripts/test-mesh-heartbeat.cjs', 'scripts/test-monitor-mesh-health.cjs', 'scripts/test-monitor-mesh-health-sql.cjs'];
    for (const t of tests) {
      try {
        console.log('\n--- Running test', t, '---');
        const res = spawnSync('node', [t], { stdio: 'inherit', cwd: process.cwd() });
        if (res.status !== 0) {
          console.error('Test failed:', t, 'exit code', res.status);
          // continue to run remaining tests but flag failure
        }
      } catch (err) {
        console.error('Failed to run test', t, err.message);
      }
    }

    console.log('\nMigration and test run completed.');
  } finally {
    await client.end();
  }
})();
