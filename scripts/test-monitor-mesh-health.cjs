#!/usr/bin/env node
'use strict';

const { createClient } = require('@supabase/supabase-js');
const { spawnSync } = require('child_process');

(async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz';

  const supService = createClient(supabaseUrl, serviceKey);

  // Create vertices & tetrahedron with no heartbeats
  const now = Date.now();
  try {
    const { data: a } = await supService.auth.admin.createUser({ email: `monitor-${now}-1@example.com`, password: 'Test123!' });
    const uid1 = a.user.id;
    await supService.from('users').insert([{ id: uid1, email: `monitor-${now}-1@example.com`, full_name: 'Monitor Test 1' }]);

    const { data: b } = await supService.auth.admin.createUser({ email: `monitor-${now}-2@example.com`, password: 'Test123!' });
    const uid2 = b.user.id;
    await supService.from('users').insert([{ id: uid2, email: `monitor-${now}-2@example.com`, full_name: 'Monitor Test 2' }]);

    const { data: c } = await supService.auth.admin.createUser({ email: `monitor-${now}-3@example.com`, password: 'Test123!' });
    const uid3 = c.user.id;
    await supService.from('users').insert([{ id: uid3, email: `monitor-${now}-3@example.com`, full_name: 'Monitor Test 3' }]);

    const { data: d } = await supService.auth.admin.createUser({ email: `monitor-${now}-4@example.com`, password: 'Test123!' });
    const uid4 = d.user.id;
    await supService.from('users').insert([{ id: uid4, email: `monitor-${now}-4@example.com`, full_name: 'Monitor Test 4' }]);

    const vertices = [uid1, uid2, uid3, uid4];
    const { data: tData } = await supService.from('tetrahedrons').insert([{ name: 'monitor-tetra', domain: 'health', vertices }]).select().single();
    const tid = tData.id;
    console.log('Created monitor tetra', tid);

    // Ensure last_heartbeat_at is null (no heartbeat)
    const { data: check, error: checkErr } = await supService.from('tetrahedrons').select('last_heartbeat_at').eq('id', tid).single();
    if (checkErr) throw checkErr;
    console.log('last_heartbeat_at:', check.last_heartbeat_at);

    // Run the monitor with threshold 0 to force alert
    const res = spawnSync('node', ['scripts/monitor-mesh-health.cjs', '--threshold-minutes', '0', '--limit', '1', '--tetrahedron-id', tid], { stdio: 'inherit' });
    if (res.status !== 0) throw new Error('monitor script failed');

    // Verify guardian alert present
    const { data: alerts, error: alertErr } = await supService.from('guardian_alerts').select('*').eq('tetrahedron_id', tid).eq('alert_type', 'mesh-degrading');
    if (alertErr) throw alertErr;
    console.log('guardian_alerts rows for tetra:', alerts.length);
    if (!alerts.length) throw new Error('No guardian_alerts created for missing heartbeat');

    // Run monitor again to ensure no duplicate (existing unresolved alert)
    const res2 = spawnSync('node', ['scripts/monitor-mesh-health.cjs', '--threshold-minutes', '0', '--limit', '1', '--tetrahedron-id', tid], { stdio: 'inherit' });
    if (res2.status !== 0) throw new Error('monitor script failed (second run)');

    const { data: alerts2 } = await supService.from('guardian_alerts').select('*').eq('tetrahedron_id', tid).eq('alert_type', 'mesh-degrading');
    console.log('guardian_alerts rows after second run:', alerts2.length);
    if (alerts2.length !== alerts.length) throw new Error('Duplicate guardian_alerts were created on repeated monitor runs');

    console.log('Monitor health test passed');

  } catch (err) {
    console.error('Error in monitor test', err.message || err);
    process.exitCode = 1;
  }
})();
