#!/usr/bin/env node
// sync-to-ws-os.mjs
// Copies the canonical production-ready build or selected files to the production folder (e.g., C:\WS-OS).
// Usage: node scripts/deploy/sync-to-ws-os.mjs --target=C:\WS-OS --files="components/ui/**,,package.json"

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import glob from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');

function parseArgs() {
  const args = {};
  for (const raw of process.argv.slice(2)) {
    const [k, v] = raw.split('=');
    if (k.startsWith('--')) args[k.slice(2)] = v || true;
  }
  return args;
}

const argv = parseArgs();
const target = argv.target || 'C:\\WS-OS';
const filesArg = argv.files || 'components/ui/**/*';
const patterns = filesArg.split(',');

console.log('Syncing to target:', target);
console.log('Using include patterns:', patterns);

if (!fs.existsSync(target)) {
  console.error('Target folder does not exist. Please create:', target);
  process.exit(1);
}

const changed = [];

for (const pattern of patterns) {
  const matches = glob.sync(pattern, { cwd: repoRoot, nodir: true });
  for (const m of matches) {
    const src = path.join(repoRoot, m);
    const dest = path.join(target, m);
    // Backup previous file
    if (fs.existsSync(dest)) {
      const backup = dest + '.bak-' + Date.now();
      fs.copyFileSync(dest, backup);
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    changed.push({ src, dest });
  }
}

console.log(`Synced ${changed.length} files to ${target}`);
changed.slice(0, 50).forEach((c) => console.log(' -', c.dest));

console.log('Sync completed. Verify and then restart the production server as needed.');
