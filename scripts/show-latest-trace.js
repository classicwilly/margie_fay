#!/usr/bin/env node
/*
Node script: find the most recent Playwright trace zip under `test-results` or `playwright-report/data`
and launch `npx playwright show-trace` on it. Then run the verification script using Node.
*/
import fs from 'fs';
import path from 'path';
import { execFileSync, spawn } from 'child_process';

const traceDirs = [path.resolve('./test-results'), path.resolve('./playwright-report/data')];

function findLatestZip(dirs) {
  let latest = null;
  for (const d of dirs) {
    if (!fs.existsSync(d)) continue;
    const files = fs.readdirSync(d).filter(f => f.endsWith('.zip')).map(f => ({
      file: path.join(d, f),
      mtime: fs.statSync(path.join(d, f)).mtime
    }));
    if (!files.length) continue;
    files.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
    if (!latest || files[0].mtime.getTime() > latest.mtime.getTime()) {
      latest = files[0];
    }
  }
  return latest ? latest.file : null;
}

const latest = findLatestZip(traceDirs);
if (!latest) {
  console.error('No zipped traces found under:', traceDirs.join(', '));
  process.exit(1);
}
console.log('Found latest trace:', latest);

try {
  // Launch the Playwright trace viewer
  console.log('Opening trace viewer...');
  if (process.platform === 'win32') {
    spawn('cmd', ['/c', 'npx', 'playwright', 'show-trace', latest], { stdio: 'inherit', detached: true });
  } else {
    spawn('npx', ['playwright', 'show-trace', latest], { stdio: 'inherit', detached: true });
  }
} catch (err) {
  console.error('Error launching show-trace:', err);
}

// Run the verify-dashboard Node script
const verifyScript = path.resolve('./scripts/verify-dashboard.js');
if (fs.existsSync(verifyScript)) {
  try {
    console.log('Running verification script via Node:', verifyScript);
    execFileSync('node', [verifyScript], { stdio: 'inherit', env: process.env });
  } catch (err) {
    console.error('verify-dashboard script returned non-zero or failed:', err.message || err);
    process.exit(err.status || 1);
  }
} else {
  console.warn('verify-dashboard.js not found; skipping verify step.');
}

process.exit(0);
