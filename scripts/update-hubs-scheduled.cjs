#!/usr/bin/env node
"use strict";

const { Client } = require('pg');

async function main() {
  const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
  const client = new Client({ connectionString: dbUrl });
  const weekday = new Date().toLocaleString('en-US', { weekday: 'long' }).toLowerCase();

  try {
    await client.connect();
    console.log('Connected to DB at', dbUrl);
    console.log('Updating hubs for weekday:', weekday);
    const sql = `
      UPDATE public.tetrahedrons
      SET hub_vertex_id = (hub_rotation_schedule ->> $1)::uuid
      WHERE (hub_rotation_schedule ? $1)
      AND (hub_vertex_id IS DISTINCT FROM (hub_rotation_schedule ->> $1)::uuid);
    `;
    const res = await client.query(sql, [weekday]);
    console.log('Rows updated:', res.rowCount);
  } catch (err) {
    console.error('Error updating hubs:', err.message || err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
