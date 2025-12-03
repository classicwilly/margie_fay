#!/usr/bin/env node
'use strict';

const { createClient } = require('@supabase/supabase-js');
const arg = require('arg');

async function run() {
  const args = arg({
    '--threshold-minutes': Number,
    '--dry-run': Boolean,
    '--limit': Number,
    '--tetrahedron-id': String,
    '-t': '--threshold-minutes',
    '-n': '--dry-run'
  }, { argv: process.argv.slice(2) });

  const thresholdMinutes = args['--threshold-minutes'] || 60;
  const dryRun = !!args['--dry-run'];
  const limit = args['--limit'] || 100;
  const tetraFilter = args['--tetrahedron-id'] || null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz';
  const supService = createClient(supabaseUrl, serviceKey);

  console.log(`Checking mesh health with threshold ${thresholdMinutes} minutes (dryRun=${dryRun})`);

  const olderThan = new Date(Date.now() - thresholdMinutes * 60 * 1000).toISOString();

  // Query tetrahedrons with missing or stale heartbeats. Use PostgREST 'or()' with filters
  const orFilter = `last_heartbeat_at.is.null,last_heartbeat_at.lte.${olderThan}`;
  let tetrasRes;
  if (tetraFilter) {
    tetrasRes = await supService.from('tetrahedrons').select('id, name, last_heartbeat_at').eq('id', tetraFilter).limit(1);
  } else {
    tetrasRes = await supService.from('tetrahedrons').select('id, name, last_heartbeat_at').or(orFilter).limit(limit);
  }
  const tetras = tetrasRes.data;
  const tErr = tetrasRes.error;
  if (tErr) throw tErr;

  console.log(`Found ${tetras.length} tetrahedrons with stale or missing heartbeats`);
  for (const t of tetras) {
    const ageMinutes = t.last_heartbeat_at ? (Date.now() - new Date(t.last_heartbeat_at).getTime()) / 60000 : null;
    let severity = 'warning';
    if (ageMinutes === null) severity = 'warning';
    else if (ageMinutes > 60 * 24) severity = 'critical';
    else if (ageMinutes > 60) severity = 'warning';

    const message = ageMinutes === null ? 'No heartbeat recorded for tetrahedron' : `Last heartbeat ${Math.round(ageMinutes)} minutes ago`;

    // Avoid posting duplicate unresolved alerts - rely on existing SQL dedupe, but we can still check for a current alert
    const { data: existing, error: exErr } = await supService.from('guardian_alerts').select('id, severity, resolved_at').eq('tetrahedron_id', t.id).eq('alert_type', 'mesh-degrading').is('resolved_at', null).limit(1).maybeSingle();
    if (exErr && exErr.code !== 'PGRST113') { // PGRST113 is "No rows found" in some clients, handle gracefully
      // If there's an error other than missing, log and proceed
      console.warn('Failed checking existing guardian alert', exErr.message || exErr);
    }
    if (existing && existing.id) {
      console.log(`Skipping ${t.id} - existing unresolved alert ${existing.id}`);
      continue;
    }

    if (dryRun) {
      console.log(`[DRY RUN] Would create alert for ${t.id} - ${message}`);
      continue;
    }

    const { data: ins, error: insErr } = await supService.from('guardian_alerts').insert([{ tetrahedron_id: t.id, alert_type: 'mesh-degrading', severity, message }]).select().single();
    if (insErr) {
      console.error('Failed to insert guardian_alerts', insErr.message || insErr);
    } else {
      console.log(`Created alert ${ins.id} for tetrahedron ${t.id} (severity=${severity})`);
    }
  }
}

(async () => {
  try {
    await run();
    process.exit(0);
  } catch (err) {
    console.error('Error running monitor script', err);
    process.exit(1);
  }
})();
