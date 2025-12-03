#!/usr/bin/env node
"use strict";

const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz';
  const supabase = createClient(url, key);

  const pgUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
  const client = new Client({ connectionString: pgUrl });
  await client.connect();

  async function createUsers(n) {
    const ids = [];
    for (let i = 0; i < n; i++) {
      const email = `num-user-${Date.now()}-${Math.round(Math.random()*1000)}-${i}@example.com`;
      const pw = 'SupabaseTest123!';
      const { data, error } = await supabase.auth.admin.createUser({ email, password: pw });
      if (error) { console.log('createUser error:', error.message || error); process.exit(3); }
      const userId = data.user.id;
      await supabase.from('users').insert([{ id: userId, email, full_name: `NUM Test User ${i}` }]);
      ids.push(userId);
    }
    return ids;
  }

  const users = await createUsers(4);
  const { data: tetra } = await supabase.from('tetrahedrons').insert([{ name: 'numbers-test', domain: 'health', vertices: users }]).select().single();
  console.log('Created tetra', tetra.id);

  // Ensure default settings
  await client.query("INSERT INTO public.protocol_settings (id, value) VALUES ('threshold_stressed_weight', 12) ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value");
  await client.query("INSERT INTO public.protocol_settings (id, value) VALUES ('threshold_alert_warning', 6) ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value");

  // Post statuses which sum to 10 (just below threshold)
  await supabase.from('status_updates').insert([{ user_id: users[0], tetrahedron_id: tetra.id, status: 'c1', category: 'emotional' }]); // 3
  await supabase.from('status_updates').insert([{ user_id: users[1], tetrahedron_id: tetra.id, status: 'p1', category: 'deep-pressure' }]); // 2
  await supabase.from('status_updates').insert([{ user_id: users[2], tetrahedron_id: tetra.id, status: 'p2', category: 'tactile' }]); // 2
  await supabase.from('status_updates').insert([{ user_id: users[3], tetrahedron_id: tetra.id, status: 'other', category: 'oral' }]); // 1
  await new Promise(r => setTimeout(r, 500));
  const { data: after } = await supabase.from('tetrahedrons').select('*').eq('id', tetra.id).single();
  console.log('next_action with default thresholds:', after.next_action);

  // Lower stressed threshold to 7 => now the total 10 should trigger stressed-delta -> suggest_calm_activity
  await client.query("INSERT INTO public.protocol_settings (id, value) VALUES ('threshold_stressed_weight', 7) ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value");
  await new Promise(r => setTimeout(r, 500));
  const { data: after2 } = await supabase.from('tetrahedrons').select('*').eq('id', tetra.id).single();
  console.log('next_action after lowering stressed threshold:', after2.next_action);

  // Raise alert threshold so that critical remains unaffected but warning higher
  await client.query("INSERT INTO public.protocol_settings (id, value) VALUES ('threshold_alert_critical', 30) ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value");

  await client.end();
}

main();
