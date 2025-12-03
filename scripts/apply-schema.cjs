#!/usr/bin/env node
"use strict";

// Script: scripts/apply-schema.cjs
// Purpose: Apply supabase/schema.sql to local supabase DB using `pg` client.

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function main() {
  const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.error('schema.sql not found at', schemaPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(schemaPath, 'utf8');

  // Use the database URL from env or default to local supabase DB
  const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

  const client = new Client({ connectionString: dbUrl });

  try {
    await client.connect();
    console.log('Connected to DB at', dbUrl);
    console.log('Applying schema (this may take a while)...');

    // Using simple execution of the entire file
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('Schema applied successfully.');
  } catch (err) {
    console.error('Error applying schema:', err.message || err);
    try { await client.query('ROLLBACK'); } catch (e) { /* ignore */ }
    process.exit(2);
  } finally {
    await client.end();
  }
}

main();
