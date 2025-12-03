#!/usr/bin/env node
"use strict";

const { Client } = require('pg');

async function main() {
  const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
  const client = new Client({ connectionString: dbUrl });
  const sql = `
  CREATE TABLE IF NOT EXISTS public.tetrahedron_actions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tetrahedron_id UUID REFERENCES public.tetrahedrons(id) NOT NULL,
    action TEXT NOT NULL,
    decided_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
  );

  ALTER TABLE public.tetrahedron_actions ENABLE ROW LEVEL SECURITY;

  DO $$
  BEGIN
    CREATE POLICY "protocol_can_insert_actions" ON public.tetrahedron_actions FOR INSERT WITH CHECK (true);
  EXCEPTION WHEN duplicate_object THEN
    -- policy exists already
  END$$;

  DO $$
  BEGIN
    CREATE POLICY "protocol_can_select_actions" ON public.tetrahedron_actions FOR SELECT USING (true);
  EXCEPTION WHEN duplicate_object THEN
    -- policy exists already
  END$$;

  CREATE INDEX IF NOT EXISTS idx_actions_tetrahedron ON public.tetrahedron_actions(tetrahedron_id);
  `;

  try {
    await client.connect();
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('tetrahedron_actions table applied');
  } catch (err) {
    console.error('Error:', err.message || err);
    try { await client.query('ROLLBACK'); } catch (e) {}
    process.exit(2);
  } finally {
    await client.end();
  }
}

main();

