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
      const email = `ga-user-${Date.now()}-${Math.round(Math.random()*1000)}-${i}@example.com`;
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
        .insert([{ id: userId, email, full_name: `GA Test User ${i}` }]);
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
    .insert([{ name: 'guardian-test', domain: 'health', vertices: users }])
    .select()
    .single();
  if (tetraErr) { console.error('tetra insert failed:', tetraErr); process.exit(5); }

  const tetraId = tetra.id;
  console.log('Created tetrahedron', tetraId);

  // Post several statuses to reach critical threshold
  const { error: s1 } = await supabase.from('status_updates').insert([{ user_id: users[0], tetrahedron_id: tetraId, status: 'crisis-1', category: 'crisis' }]);
  const { error: s2 } = await supabase.from('status_updates').insert([{ user_id: users[1], tetrahedron_id: tetraId, status: 'crisis-2', category: 'crisis' }]);
  // Wait for triggers
  await new Promise(resolve => setTimeout(resolve, 1000));

  const { data: alerts } = await supabase.from('guardian_alerts').select('*').eq('tetrahedron_id', tetraId);
  console.log('Guardian alerts for tetra:', alerts);
}

main();
