#!/usr/bin/env node
"use strict";

const { createClient } = require('@supabase/supabase-js');

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz';
  const supabase = createClient(url, key);

  async function tryInsert(name, vertices, extra = {}) {
    try {
      const insertObj = { name, domain: 'health', vertices, ...extra };
      const { data, error } = await supabase
        .from('tetrahedrons')
        .insert([insertObj])
        .select()
        .single();

      if (error) {
        console.log(`INSERT FAILED for ${name}:`, error.message || error);
        return { success: false, error };
      } else {
        console.log(`INSERT OK for ${name}: id=${data.id}`);
        return { success: true, data };
      }
    } catch (err) {
      console.log(`EXCEPTION for ${name}:`, err.message || err);
      return { success: false, error: err };
    }
  }

  async function createUsers(n) {
    const ids = [];
    for (let i = 0; i < n; i++) {
      const email = `test-user-${Date.now()}-${Math.round(Math.random()*1000)}-${i}@example.com`;
      const pw = 'SupabaseTest123!';
      const { data, error } = await supabase.auth.admin.createUser({ email, password: pw });
      if (error) {
        console.log('createUser error:', error.message || error);
        process.exit(3);
      }
      const userId = data.user.id;
      // Also create a profile row in public.users to satisfy FK constraints
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .insert([{ id: userId, email, full_name: `Test User ${i}` }]);
      if (profileError) {
        console.log('createPublicUser error:', profileError.message || profileError);
        process.exit(4);
      }
      ids.push(userId);
    }
    return ids;
  }

  // Valid (create users and use their ids)
  const validUsers = await createUsers(4);
  await tryInsert('valid-tetrahedron', validUsers);

  // Invalid length
  const lenUsers = await createUsers(3);
  await tryInsert('invalid-length', lenUsers);

  // Invalid duplicate
  const dupUsers = await createUsers(4);
  // duplicate the first user id
  await tryInsert('invalid-duplicate', [dupUsers[0], dupUsers[0], dupUsers[2], dupUsers[3]]);


  // hub is a vertex (should succeed)
  const hubUsers = await createUsers(4);
  // Try with hub null - should be set by protocol
  const hubOk = await tryInsert('hub-protocol-set', hubUsers);
  console.log('Hub was set by protocol (non-empty):', hubOk.success);

  // Try with hub explicitly set to protocol value -> must succeed
  const createdAt = new Date().toISOString();
  // determine protocol hub client-side to test expectation
  // Use the deterministic helper RPC to compute proper hub on the server when testing
  const hubDetUsers = await createUsers(4);
  const createdAt2 = new Date().toISOString();
  const { data: expectedData, error: expectedErr } = await supabase.rpc('deterministic_hub_vertex', { vertices: hubDetUsers, created_at: createdAt2 });
  if (expectedErr) { console.log('rpc error:', expectedErr.message || expectedErr); }
  const expected = expectedData;
  // Now try insertion with that expected hub and explicit created_at
  const { data: preInsert } = await supabase
    .from('tetrahedrons')
    .insert([{ name: 'hub-explicit', domain: 'health', vertices: hubDetUsers, created_at: createdAt2, hub_vertex_id: expected }])
    .select()
    .single();
  console.log('Explicit correct hub insert success:', !!preInsert, 'expected:', expected);

  // Try with hub explicitly set to an incorrect value -> should fail
  const hubInvalidUsers2 = await createUsers(4);
  await tryInsert('hub-invalid-explicit', hubInvalidUsers2, { hub_vertex_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff' });

  // hub invalid (not a vertex)
  const hubInvalidUsers = await createUsers(4);
  await tryInsert('hub-invalid', hubInvalidUsers, { hub_vertex_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff' });

  // hub rotation schedule valid
  const rotUsers = await createUsers(4);
  await tryInsert('rot-valid', rotUsers, { hub_rotation_schedule: { monday: rotUsers[0] } });

  // hub rotation schedule with invalid key
  const rotInvalidKeyUsers = await createUsers(4);
  await tryInsert('rot-invalid-key', rotInvalidKeyUsers, { hub_rotation_schedule: { funday: rotInvalidKeyUsers[0] } });

  // hub rotation schedule with invalid value (not in vertices)
  const rotInvalidValueUsers = await createUsers(4);
  await tryInsert('rot-invalid-value', rotInvalidValueUsers, { hub_rotation_schedule: { monday: 'ffffffff-ffff-ffff-ffff-ffffffffffff' } });
}

main();
