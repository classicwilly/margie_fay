#!/usr/bin/env node
"use strict";

const { createClient } = require('@supabase/supabase-js');

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz';
  const supabase = createClient(url, key);

  // create users & tetra
  async function createUsers(n) {
    const ids = [];
    for (let i = 0; i < n; i++) {
      const email = `na-user-${Date.now()}-${Math.round(Math.random()*1000)}-${i}@example.com`;
      const pw = 'SupabaseTest123!';
      const { data, error } = await supabase.auth.admin.createUser({ email, password: pw });
      if (error) { console.log('createUser error:', error.message || error); process.exit(3); }
      const userId = data.user.id;
      await supabase.from('users').insert([{ id: userId, email, full_name: `NA Test User ${i}` }]);
      ids.push(userId);
    }
    return ids;
  }

  const users = await createUsers(4);
  const { data: tetra, error: tetraErr2 } = await supabase.from('tetrahedrons').insert([{ name: 'next-action-test', domain: 'health', vertices: users }]).select().single();
  if (tetraErr2) { console.log('tetra insert error:', tetraErr2); process.exit(1); }
  console.log('Created tetra', tetra.id, 'next_action:', tetra.next_action);

  // Case A: stressed-delta -> set statuses of crisis/emotional to push to stressed -> expect 'suggest_calm_activity'
  await supabase.from('status_updates').insert([{ user_id: users[0], tetrahedron_id: tetra.id, status: 'c1', category: 'crisis' }]);
  await supabase.from('status_updates').insert([{ user_id: users[1], tetrahedron_id: tetra.id, status: 'e1', category: 'emotional' }]);
  await new Promise(resolve => setTimeout(resolve, 500));
  const { data: tetraA } = await supabase.from('tetrahedrons').select('*').eq('id', tetra.id).single();
  console.log('after stressed statuses next_action:', tetraA.next_action);

  // Case B: positive-wye -> post 3 positive statuses -> expect 'celebrate'
  await supabase.from('status_updates').insert([{ user_id: users[2], tetrahedron_id: tetra.id, status: 'dp1', category: 'deep-pressure' }]);
  await supabase.from('status_updates').insert([{ user_id: users[3], tetrahedron_id: tetra.id, status: 'p1', category: 'proprioceptive' }]);
  await supabase.from('status_updates').insert([{ user_id: users[0], tetrahedron_id: tetra.id, status: 't1', category: 'tactile' }]);
  await new Promise(resolve => setTimeout(resolve, 500));
  const { data: tetraB } = await supabase.from('tetrahedrons').select('*').eq('id', tetra.id).single();
  console.log('after positive statuses next_action:', tetraB.next_action);

  // Case C: schedule rotation -> apply hub_rotation_schedule mapping for today and expect rotate_hub
  const weekday = new Date().toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
  const rotationSchedule = {};
  rotationSchedule[weekday] = users[0];
  await supabase.from('tetrahedrons').update({ hub_rotation_schedule: rotationSchedule }).eq('id', tetra.id);
  await new Promise(resolve => setTimeout(resolve, 500));
  const { data: tetraC } = await supabase.from('tetrahedrons').select('*').eq('id', tetra.id).single();
  console.log('after schedule set next_action:', tetraC.next_action);
}

main();
