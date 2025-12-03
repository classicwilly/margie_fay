#!/usr/bin/env node
"use strict";

const { Client } = require('pg');

async function main() {
  const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
  const client = new Client({ connectionString: dbUrl });
  const sql = `
    CREATE TABLE IF NOT EXISTS public.protocol_settings (
      id TEXT PRIMARY KEY,
      value NUMERIC NOT NULL
    );
    ALTER TABLE public.protocol_settings ENABLE ROW LEVEL SECURITY;

    DO $$
    BEGIN
      CREATE POLICY "protocol_settings_read" ON public.protocol_settings FOR SELECT USING (true);
    EXCEPTION WHEN duplicate_object THEN
    END$$;

    DO $$
    BEGIN
      CREATE POLICY "protocol_settings_write" ON public.protocol_settings FOR INSERT WITH CHECK (auth.role() = 'service_role');
    EXCEPTION WHEN duplicate_object THEN
    END$$;

    CREATE INDEX IF NOT EXISTS idx_protocol_settings_id ON public.protocol_settings(id);
  `;

  try {
    await client.connect();
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('protocol_settings table applied');
  } catch (err) {
    console.error('Error:', err.message || err);
    try { await client.query('ROLLBACK'); } catch (e) {}
    process.exit(2);
  } finally {
    await client.end();
  }
}

main();
