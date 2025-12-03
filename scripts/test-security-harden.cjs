#!/usr/bin/env node
'use strict';

const { createClient } = require('@supabase/supabase-js');
const { Client } = require('pg');

async function checkExecutePrivilege(client, functName, role = 'service_role') {
  const q = `SELECT has_function_privilege('${role}', '${functName}', 'EXECUTE') as has_exec`;
  const res = await client.query(q);
  return res.rows[0] && res.rows[0].has_exec;
}

(async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'anon-key-fallback';

  const pgUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
  const pgClient = new Client({ connectionString: pgUrl });
  await pgClient.connect();

  try {
    // check owners
    const functionsToCheck = [
      'compute_jitterbug_state(uuid)', 'compute_next_action(uuid)', 'set_next_action_and_log(uuid)',
      'maybe_create_guardian_alert(uuid)', 'update_tetrahedron_state_on_status()', 'next_action_on_state_change()',
      'enforce_tetrahedron_vertices_unique()', 'recompute_all_tetrahedron_states_and_actions()',
      'record_mesh_heartbeat(uuid, text, jsonb)',
      'check_mesh_heartbeats_and_alert(int)'
    ];
    for (const f of functionsToCheck) {
      const hasExec = await checkExecutePrivilege(pgClient, f);
      console.log(`Function ${f} executable by 'service_role':`, hasExec);
    }

    // Verify RLS: protocol_settings write only via service_role
    const supService = createClient(supabaseUrl, serviceKey);
    const supAnon = createClient(supabaseUrl, anonKey);

    // service role can write
    try {
      const { error } = await supService.from('protocol_settings').insert([{ id: 'test_rls_write', value: 1 }]);
      if (error) {
        console.error('service role failed to write protocol_settings', error.message || error);
      } else {
        console.log('service role successfully wrote to protocol_settings');
      }
    } catch (err) {
      console.error('service role write test failed', err.message || err);
    }

    // anon role should not write: expect error
    try {
      const { error } = await supAnon.from('protocol_settings').insert([{ id: 'test_rls_write_anon', value: 2 }]);
      if (error) {
        console.log('anon user write to protocol_settings failed (expected):', error.message || error);
      } else {
        console.warn('anon user write to protocol_settings succeeded unexpectedly - RLS may be open');
      }
    } catch (err) {
      console.log('anon write attempt threw error (expected):', err.message || err);
    }

    // validate audit triggers: update hub or jitterbug to create entries
    let res;
    // create users & tetrahedron for test
    const { data: a, error: adminErr } = await supService.auth.admin.createUser({ email: `audit-${Date.now()}-1@example.com`, password: 'Test123!' });
    if (adminErr) { throw adminErr; }
    const uid1 = a.user.id;
    const { data: profileData1 } = await supService.from('users').insert([{ id: uid1, email: `audit1-${Date.now()}@example.com`, full_name: 'Audit Test 1' }]);

    const { data: a2 } = await supService.auth.admin.createUser({ email: `audit-${Date.now()}-2@example.com`, password: 'Test123!' });
    const uid2 = a2.user.id;
    const { data: profileData2 } = await supService.from('users').insert([{ id: uid2, email: `audit2-${Date.now()}@example.com`, full_name: 'Audit Test 2' }]);

    const vertices = [uid1, uid2, uid1, uid2];
    // ensure vertices are unique; create 2 more users
    const { data: u3 } = await supService.auth.admin.createUser({ email: `audit-${Date.now()}-3@example.com`, password: 'Test123!' });
    const uid3 = u3.user.id;
    await supService.from('users').insert([{ id: uid3, email: `audit3-${Date.now()}@example.com`, full_name: 'Audit Test 3' }]);
    const { data: u4 } = await supService.auth.admin.createUser({ email: `audit-${Date.now()}-4@example.com`, password: 'Test123!' });
    const uid4 = u4.user.id;
    await supService.from('users').insert([{ id: uid4, email: `audit4-${Date.now()}@example.com`, full_name: 'Audit Test 4' }]);

    const tetraVertices = [uid1, uid2, uid3, uid4];
    const { data: tData, error: tErr } = await supService.from('tetrahedrons').insert([{ name: 'audit-tetra', domain: 'health', vertices: tetraVertices }]).select().single();
    if (tErr) { throw tErr; }
    const tid = tData.id;
    console.log('Created audit tetra', tid);

    // update hub to trigger history
    const { error: hubUpdateErr } = await supService.from('tetrahedrons').update({ hub_vertex_id: uid2 }).eq('id', tid);
    if (hubUpdateErr) { console.error('Error updating hub for audit test:', hubUpdateErr.message || hubUpdateErr); }
    else console.log('Updated hub successfully');

    // update jitterbug state via status update, add crisis to trigger update
    const { data: st } = await supService.from('status_updates').insert([{ user_id: uid1, tetrahedron_id: tid, status: 'crisis-test', category: 'crisis' }]).select().single();
    console.log('Inserted status update to cause jitterbug recompute', st.id);

    // inspect audit tables
    const hubHistory = await supService.from('tetrahedron_hub_history').select('*').eq('tetrahedron_id', tid);
    const jbh = await supService.from('jitterbug_state_history').select('*').eq('tetrahedron_id', tid);
    if (hubHistory.error) console.error('Hub history select error:', hubHistory.error.message || hubHistory.error);
    if (jbh.error) console.error('Jitterbug history select error:', jbh.error.message || jbh.error);
    console.log('Hub history rows (sample):', hubHistory.data ? hubHistory.data.length : 'null');
    console.log('Jitterbug state history rows (sample):', jbh.data ? jbh.data.length : 'null');

  } finally {
    await pgClient.end();
  }

  console.log('Security & audit checks finished');
})();
