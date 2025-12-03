#!/usr/bin/env node
"use strict";

const { createClient } = require('@supabase/supabase-js');

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz';
  const supabase = createClient(url, key);

  // create 4 users
  async function createUsers(n) {
    const ids = [];
    for (let i = 0; i < n; i++) {
      const email = `jb-user-${Date.now()}-${Math.round(Math.random()*1000)}-${i}@example.com`;
      const pw = 'SupabaseTest123!';
      const { data, error } = await supabase.auth.admin.createUser({ email, password: pw });
      if (error) {
        console.log('createUser error:', error.message || error);
        process.exit(3);
      }
      const userId = data.user.id;
      // create public profile
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .insert([{ id: userId, email, full_name: `JB Test User ${i}` }]);
      if (profileError) {
        console.log('createPublicUser error:', profileError.message || profileError);
        process.exit(4);
      }
      ids.push(userId);
    }
    return ids;
  }

  const users = await createUsers(4);
  const { data: tetra, error: tetraErr } = await supabase
    .from('tetrahedrons')
    .insert([{ name: 'jitter-test', domain: 'health', vertices: users }])
    .select()
    .single();
  if (tetraErr) { console.error('tetra insert failed:', tetraErr); process.exit(5); }

  const tetraId = tetra.id;
  console.log('Created tetrahedron', tetraId);

  async function postStatus(userId, category) {
    const { data, error } = await supabase
      .from('status_updates')
      .insert([{ user_id: userId, tetrahedron_id: tetraId, status: `status-${category}-${Date.now()}`, category }])
      .select()
      .single();
    if (error) { console.error('status insert failed:', error); return; }
    console.log('Inserted status', category, 'id', data.id);
  }

  // Insert statuses to force stressed-delta
  await postStatus(users[0], 'crisis');
  await postStatus(users[1], 'emotional');
  // Insert statuses to add positive ones
  await postStatus(users[2], 'deep-pressure');
  await postStatus(users[3], 'proprioceptive');

  // Wait for triggers to update (should be immediate) and fetch tetra
  await new Promise((resolve) => setTimeout(resolve, 500));
  const { data: updatedTetra } = await supabase
    .from('tetrahedrons')
    .select('*')
    .eq('id', tetraId)
    .single();
  console.log('Updated tetra jitterbug_state:', updatedTetra.jitterbug_state);
}

main();
