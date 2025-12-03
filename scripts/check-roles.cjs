#!/usr/bin/env node
'use strict';
const { Client } = require('pg');
(async () => {
  const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
  const client = new Client({ connectionString: dbUrl });
  await client.connect();
  try {
    const res = await client.query("SELECT rolname FROM pg_roles WHERE rolname = 'app_service' OR rolname LIKE '%service%';");
    console.log('Roles matching app_service or *service*:', res.rows.map(r => r.rolname));
  } finally {
    await client.end();
  }
})();
