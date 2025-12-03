#!/usr/bin/env node
"use strict";
const { Client } = require('pg');
(async () => {
  const c = new Client({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres' });
  await c.connect();
  const res = await c.query("select proname from pg_proc where proname like 'maybe_%' or proname like '%guardian%';");
  console.log(res.rows);
  await c.end();
})();
