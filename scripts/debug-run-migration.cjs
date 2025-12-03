#!/usr/bin/env node
'use strict';

// Debug runner for migration SQL that isolates the failing statement
const fs = require('fs');
const { Client } = require('pg');

function splitSql(sql) {
  const statements = [];
  let current = '';
  let i = 0;
  let inDollar = false;
  let dollarTag = '';
  let inSingleLineComment = false;
  let inBlockComment = false;
  while (i < sql.length) {
    const nextTwo = sql.slice(i, i+2);
    const ch = sql[i];
    if (inSingleLineComment) {
      current += ch;
      if (ch === '\n') inSingleLineComment = false;
      i++;
      continue;
    }
    if (inBlockComment) {
      current += ch;
      if (nextTwo === '*/') {
        current += '/';
        inBlockComment = false;
        i += 2;
        continue;
      }
      i++;
      continue;
    }
    if (!inDollar && nextTwo === '--') {
      inSingleLineComment = true;
      current += nextTwo;
      i += 2;
      continue;
    }
    if (!inDollar && nextTwo === '/*') {
      inBlockComment = true;
      current += nextTwo;
      i += 2;
      continue;
    }
    if (!inDollar && sql.slice(i, i+2) === '$$') {
      inDollar = true;
      dollarTag = '$$';
      current += '$$';
      i += 2;
      continue;
    }
    if (inDollar && dollarTag && sql.slice(i, i+2) === dollarTag) {
      inDollar = false;
      current += dollarTag;
      i += 2;
      continue;
    }
    if (!inDollar && ch === ';') {
      current += ch;
      statements.push(current.trim());
      current = '';
      i++;
      continue;
    }
    current += ch;
    i++;
  }
  if (current.trim()) statements.push(current.trim());
  return statements;
}

(async () => {
  const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
  const client = new Client({ connectionString: dbUrl });
  await client.connect();
  const migrationFile = process.argv[2] || 'supabase/migrations/20251202_000000_tetrahedron_schema.sql';
  const sql = fs.readFileSync(migrationFile, 'utf8');
  const statements = splitSql(sql);
  console.log('Statements split:', statements.length);
  let idx = 0;
  for (const st of statements) {
    idx++;
    try {
      console.log('\n--- Executing statement', idx, 'size', st.length, '---');
      // print first 200 chars
      console.log(st.slice(0, 200));
      await client.query(st);
    } catch (err) {
      console.error('Error on statement', idx, 'message:', err.message);
      console.error('Statement content (first 600 chars)\n', st.slice(0, 600));
      await client.end();
      process.exit(1);
    }
  }
  console.log('All statements applied successfully');
  await client.end();
})();
