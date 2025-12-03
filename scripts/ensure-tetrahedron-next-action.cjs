#!/usr/bin/env node
"use strict";

const { Client } = require('pg');

async function main() {
  const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
  const client = new Client({ connectionString: dbUrl });
  const sql = `
    ALTER TABLE public.tetrahedrons ADD COLUMN IF NOT EXISTS next_action TEXT;
    CREATE INDEX IF NOT EXISTS idx_tetra_next_action ON public.tetrahedrons(next_action);
  `;
  try {
    await client.connect();
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('next_action column ensured');
  } catch (err) {
    console.error('Error:', err.message || err);
    try { await client.query('ROLLBACK'); } catch(e){}
    process.exit(2);
  } finally {
    await client.end();
  }
}

main();
