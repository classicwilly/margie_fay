#!/usr/bin/env node
'use strict';

const { createClient } = require('@supabase/supabase-js');

// Wrap with full error handling to avoid unhandled promise rejections
// Ensure we catch any unhandled rejections
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection', reason);
  process.exit(1);
});

(async () => {
  try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz';

  const supService = createClient(supabaseUrl, serviceKey);

  // Create a user and tetrahedron
  const now = Date.now();
  let uid; let uid2;
  try {
    const { data: a, error: adminErr } = await supService.auth.admin.createUser({ email: `heartbeat-${now}-1@example.com`, password: 'Test123!' });
    if (adminErr) { console.error('createUser adminErr', adminErr); process.exitCode = 1; return; }
    uid = a.user.id;
    const { data: profileData1, error: pdErr } = await supService.from('users').insert([{ id: uid, email: `heartbeat-${now}-1@example.com`, full_name: 'Heartbeat Test' }]);
    if (pdErr) { console.error('Error inserting user profile 1', pdErr); process.exitCode = 1; return; }
  } catch (err) {
    console.error('Error creating user1', err);
    process.exitCode = 1; return;
  }

  try {
    const { data: u2, error: adminErr2 } = await supService.auth.admin.createUser({ email: `heartbeat-${now}-2@example.com`, password: 'Test123!' });
    if (adminErr2) { console.error('createUser adminErr2', adminErr2); process.exitCode = 1; return; }
    uid2 = u2.user.id;
    const { data: profileData2, error: pdErr2 } = await supService.from('users').insert([{ id: uid2, email: `heartbeat-${now}-2@example.com`, full_name: 'Heartbeat Test 2' }]);
    if (pdErr2) { console.error('Error inserting user profile 2', pdErr2); process.exitCode = 1; return; }
  } catch (err) {
    console.error('Error creating user2', err);
    process.exitCode = 1; return;
  }

  // Create two more users so tetrahedron vertices are unique
  let uid3; let uid4;
  try {
    const { data: u3, error: adminErr3 } = await supService.auth.admin.createUser({ email: `heartbeat-${now}-3@example.com`, password: 'Test123!' });
    if (adminErr3) { console.error('createUser adminErr3', adminErr3); process.exitCode = 1; return; }
    uid3 = u3.user.id;
    const { data: profileData3, error: pdErr3 } = await supService.from('users').insert([{ id: uid3, email: `heartbeat-${now}-3@example.com`, full_name: 'Heartbeat Test 3' }]);
    if (pdErr3) { console.error('Error inserting user profile 3', pdErr3); process.exitCode = 1; return; }
  } catch (err) {
    console.error('Error creating user3', err);
    process.exitCode = 1; return;
  }
  try {
    const { data: u4, error: adminErr4 } = await supService.auth.admin.createUser({ email: `heartbeat-${now}-4@example.com`, password: 'Test123!' });
    if (adminErr4) { console.error('createUser adminErr4', adminErr4); process.exitCode = 1; return; }
    uid4 = u4.user.id;
    const { data: profileData4, error: pdErr4 } = await supService.from('users').insert([{ id: uid4, email: `heartbeat-${now}-4@example.com`, full_name: 'Heartbeat Test 4' }]);
    if (pdErr4) { console.error('Error inserting user profile 4', pdErr4); process.exitCode = 1; return; }
  } catch (err) {
    console.error('Error creating user4', err);
    process.exitCode = 1; return;
  }
  const vertices = [uid, uid2, uid3, uid4];
  const { data: tData, error: tErr } = await supService.from('tetrahedrons').insert([{ name: 'heartbeat-tetra', domain: 'health', vertices }]).select().single();
  if (tErr) throw tErr;
  const tid = tData.id;
  console.log('Created heartbeat tetra', tid);

  // Call RPC to record heartbeat (service role) — simulating device ping via backend
  try {
    const { error: rpcErr, data: rpcData } = await supService.rpc('record_mesh_heartbeat', { t_uuid: tid, src: 'ci-test', payload: { ping: true } });
    if (rpcErr) {
      console.error('Error calling record_mesh_heartbeat via RPC:', rpcErr.message || rpcErr);
      process.exitCode = 1; return;
    }
    console.log('Called record_mesh_heartbeat successfully via RPC', rpcData || 'no-return');
  } catch (err) {
    console.error('RPC call threw:', err.message || err);
    process.exitCode = 1; return;
  }

  // Check heartbeat log rows
  const { data: rows, error: hbErr } = await supService.from('mesh_heartbeats').select('*').eq('tetrahedron_id', tid);
  if (hbErr) {
    console.error('Failed to read mesh_heartbeats rows:', hbErr.message || hbErr);
    process.exitCode = 1; return;
  } else {
    console.log('mesh_heartbeats rows:', rows ? rows.length : 0);
  }

  // Check last_heartbeat_at on tetrahedrons
  const { data: tetData, error: tetErr } = await supService.from('tetrahedrons').select('last_heartbeat_at').eq('id', tid).single();
  if (tetErr) {
    console.error('Failed to read tetrahedrons.last_heartbeat_at:', tetErr.message || tetErr);
    process.exitCode = 1; return;
  } else {
    console.log('tetrahedron last_heartbeat_at:', tetData.last_heartbeat_at);
  }

    console.log('Mesh heartbeat checks finished');
  } catch (err) {
    console.error('Unexpected error in mesh heartbeat test', err);
    process.exitCode = 1;
  }
})();
