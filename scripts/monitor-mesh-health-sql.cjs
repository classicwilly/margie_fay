#!/usr/bin/env node
'use strict';

const { createClient } = require('@supabase/supabase-js');
const arg = require('arg');

(async () => {
  try {
    const args = arg({ '--threshold-minutes': Number, '-t': '--threshold-minutes' }, { argv: process.argv.slice(2) });
    const thresholdMinutes = args['--threshold-minutes'] || 60;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz';
    const supService = createClient(supabaseUrl, serviceKey);

    console.log(`Calling SQL checker RPC with threshold ${thresholdMinutes} minutes`);
    const { error } = await supService.rpc('check_mesh_heartbeats_and_alert', { threshold_minutes: thresholdMinutes });
    if (error) {
      console.error('RPC returned error', error);
      process.exit(1);
    }
    console.log('SQL checker RPC executed successfully');
  } catch (err) {
    console.error('Unexpected error running SQL checker', err);
    process.exit(1);
  }
})();
