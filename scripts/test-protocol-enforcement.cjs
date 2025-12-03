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
      const email = `pe-user-${Date.now()}-${Math.round(Math.random()*1000)}-${i}@example.com`;
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
        .insert([{ id: userId, email, full_name: `PE Test User ${i}` }]);
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
    .insert([{ name: 'protocol-enforce-test', domain: 'health', vertices: users }])
    .select()
    .single();
  if (tetraErr) { console.error('tetra insert failed:', tetraErr); process.exit(5); }

  const tetraId = tetra.id;
  console.log('Created tetrahedron', tetraId, 'jitterbug_state:', tetra.jitterbug_state);

  // Try to manually update jitterbug_state to incorrect value (should fail)
  const { data, error } = await supabase
    .from('tetrahedrons')
    .update({ jitterbug_state: 'negative-wye' })
    .eq('id', tetraId)
    .select()
    .single();
  if (error) {
    console.log('Manual jitterbug override rejected as expected:', error.message || error);
  } else {
    console.error('Manual jitterbug override succeeded unexpectedly:', data);
  }

  // Compute expected hub by calling deterministic function via pg (use rpc in supabase?)
  const { data: expectedHub, error: rpcErr } = await supabase.rpc('deterministic_hub_vertex', { vertices: users, created_at: tetra.created_at });
  if (rpcErr) console.log('rpc error:', rpcErr.message || rpcErr);
  console.log('Expected protocol hub:', expectedHub);

  // Try to set hub to an incorrect value (should fail)
  const { data: hubData, error: hubErr } = await supabase
    .from('tetrahedrons')
    .update({ hub_vertex_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff' })
    .eq('id', tetraId)
    .select()
    .single();
  if (hubErr) console.log('Manual hub override rejected as expected:', hubErr.message || hubErr); else console.error('Manual hub override succeeded unexpectedly - hubData:', hubData);

  // Try to set hub to the expected deterministic hub (should be accepted)
  const { data: hubOk, error: hubOkErr } = await supabase
    .from('tetrahedrons')
    .update({ hub_vertex_id: expectedHub })
    .eq('id', tetraId)
    .select()
    .single();
  if (hubOkErr) console.error('Setting hub to expected value failed:', hubOkErr.message || hubOkErr); else console.log('Setting hub to expected value succeeded');
}

main();
