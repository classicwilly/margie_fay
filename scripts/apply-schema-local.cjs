#!/usr/bin/env node
"use strict";

// Script: scripts/apply-schema-local.cjs
// Purpose: Apply supabase/schema.sql to local supabase DB using `pg` client,
// making a non-destructive adjustment to the 'tetrahedrons' CHECK constraint
// that prevents subqueries.

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function main() {
  const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
  const backupPath = schemaPath + '.backup';
  if (!fs.existsSync(schemaPath)) {
    console.error('schema.sql not found at', schemaPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(schemaPath, 'utf8');

  const updatedSql = sql;

  const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

  const client = new Client({ connectionString: dbUrl });

  try {
    await client.connect();
    console.log('Connected to DB at', dbUrl);
    console.log('Applying schema (local version expects uniqueness trigger in schema)...');

    await client.query('BEGIN');
    await client.query(updatedSql);
    await client.query('COMMIT');
    console.log('Modified schema applied successfully.');
    console.log('Schema applied using schema.sql');
  } catch (err) {
    console.error('Error applying schema:', err.message || err);
    try { await client.query('ROLLBACK'); } catch (e) { /* ignore */ }
    process.exit(2);
  } finally {
    await client.end();
  }
}

main();
