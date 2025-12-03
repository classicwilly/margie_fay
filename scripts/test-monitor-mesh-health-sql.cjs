#!/usr/bin/env node
'use strict';

const { createClient } = require('@supabase/supabase-js');
const { spawnSync } = require('child_process');

(async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz';
  const supService = createClient(supabaseUrl, serviceKey);

  const now = Date.now();
  try {
    const { data: a } = await supService.auth.admin.createUser({ email: `monitor-sql-${now}-1@example.com`, password: 'Test123!' });
    const uid1 = a.user.id; await supService.from('users').insert([{ id: uid1, email: `monitor-sql-${now}-1@example.com`, full_name: 'Monitor SQL Test 1' }]);
    const { data: b } = await supService.auth.admin.createUser({ email: `monitor-sql-${now}-2@example.com`, password: 'Test123!' });
    const uid2 = b.user.id; await supService.from('users').insert([{ id: uid2, email: `monitor-sql-${now}-2@example.com`, full_name: 'Monitor SQL Test 2' }]);
    const { data: c } = await supService.auth.admin.createUser({ email: `monitor-sql-${now}-3@example.com`, password: 'Test123!' });
    const uid3 = c.user.id; await supService.from('users').insert([{ id: uid3, email: `monitor-sql-${now}-3@example.com`, full_name: 'Monitor SQL Test 3' }]);
    const { data: d } = await supService.auth.admin.createUser({ email: `monitor-sql-${now}-4@example.com`, password: 'Test123!' });
    const uid4 = d.user.id; await supService.from('users').insert([{ id: uid4, email: `monitor-sql-${now}-4@example.com`, full_name: 'Monitor SQL Test 4' }]);

    const vertices = [uid1, uid2, uid3, uid4];
    const { data: tData } = await supService.from('tetrahedrons').insert([{ name: 'monitor-sql-tetra', domain: 'health', vertices }]).select().single();
    const tid = tData.id;
    console.log('Created monitor SQL tetra', tid);

    // Run the RPC checker function to create guardian alerts
    const { error } = await supService.rpc('check_mesh_heartbeats_and_alert', { threshold_minutes: 0 });
    if (error) {
      console.error('RPC returned error', error);
      process.exit(1);
    }

    const { data: alerts, error: alertErr } = await supService.from('guardian_alerts').select('*').eq('tetrahedron_id', tid).eq('alert_type', 'mesh-degrading');
    if (alertErr) throw alertErr;
    console.log('guardian_alerts rows for tetra:', alerts.length);
    if (!alerts.length) throw new Error('No guardian_alerts created by RPC checker');

    // Run again to ensure idempotent behavior
    const { error: secondCallErr } = await supService.rpc('check_mesh_heartbeats_and_alert', { threshold_minutes: 0 });
    if (secondCallErr) {
      console.error('RPC second call returned error', secondCallErr);
      process.exit(1);
    }

    const { data: alerts2 } = await supService.from('guardian_alerts').select('*').eq('tetrahedron_id', tid).eq('alert_type', 'mesh-degrading');
    console.log('guardian_alerts rows after second run:', alerts2.length);
    if (alerts2.length !== alerts.length) throw new Error('Duplicate guardian_alerts were created on repeated SQL checker runs');

    console.log('Monitor SQL checker test passed');

  } catch (err) {
    console.error('Error in monitor SQL test', err.message || err);
    process.exitCode = 1;
  }
})();
