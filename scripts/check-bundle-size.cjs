#!/usr/bin/env node
// Simple bundle size check for CI
// Returns non-zero exit code if any .js file in dist exceeds threshold
const fs = require('fs');
const path = require('path');
const threshold = process.env.BUNDLE_THRESHOLD ? parseInt(process.env.BUNDLE_THRESHOLD, 10) : 400 * 1024;
const distDir = path.join(process.cwd(), 'dist');

function walk(dir) {
  const results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results.push(...walk(full));
    } else {
      results.push({ path: full, size: stat.size });
    }
  });
  return results;
}

if (!fs.existsSync(distDir)) {
  console.error('dist directory not found. Run `npm run build` first.');
  process.exit(2);
}

const files = walk(distDir).filter(f => f.path.endsWith('.js'));
let failed = false;
files.sort((a,b) => b.size - a.size).slice(0, 10).forEach((f) => {
  const kb = (f.size / 1024).toFixed(1);
  console.log(`${kb}KB - ${path.relative(distDir, f.path)}`);
  if (f.size > threshold) {
    console.error(`Error: ${path.relative(distDir, f.path)} exceeds threshold ${threshold} bytes (${kb} KB)`);
    failed = true;
  }
});

if (failed) process.exit(1);
console.log('Bundle size check passed.');
process.exit(0);
