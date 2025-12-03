#!/usr/bin/env node
"use strict";

const { createClient } = require('@supabase/supabase-js');

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz';

  const supabase = createClient(url, key);

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error selecting users:', error.message || error);
      process.exit(2);
    }

    console.log('users length:', data?.length || 0);
  } catch (err) {
    console.error('Exception:', err.message || err);
    process.exit(3);
  }
}

main();
