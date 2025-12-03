#!/usr/bin/env node
"use strict";
const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz';
  const supabase = createClient(url, key);
  const tetraRes = await supabase
    .from('tetrahedrons')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  const tetra = tetraRes.data;
  console.log('Latest tetra id: ', tetra.id, 'jitterbug_state:', tetra.jitterbug_state);

  const statuses = await supabase
    .from('status_updates')
    .select('*')
    .eq('tetrahedron_id', tetra.id)
    .order('created_at', { ascending: true });
  console.log('Statuses:', statuses.data.map(s => ({ id: s.id, category: s.category })));

  // Run function directly using `pg` to avoid supabase rpc issues
  const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
  const pg = new Client({ connectionString: dbUrl });
  await pg.connect();
  const res = await pg.query('SELECT compute_jitterbug_state($1::uuid) as state', [tetra.id]);
  console.log('SQL computed state:', res.rows[0] && res.rows[0].state);
  await pg.end();
}

main();
