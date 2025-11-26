#!/usr/bin/env node
// Restore files in node_modules that were renamed with `.disabled` suffix
const fs = require("fs");
const path = require("path");

function walk(dir) {
  const res = [];
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) res.push(...walk(full));
    else res.push(full);
  }
  return res;
}

function restore(repoRoot) {
  const nm = path.join(repoRoot, "node_modules");
  if (!fs.existsSync(nm)) return;
  const all = walk(nm);
  const disabled = all.filter((p) => p.endsWith(".disabled"));
  for (const f of disabled) {
    const orig = f.replace(/\.disabled$/, "");
    if (fs.existsSync(orig)) {
      console.log("Original exists, skipping:", orig);
      continue;
    }
    try {
      fs.copyFileSync(f, orig);
      fs.unlinkSync(f);
      console.log("Restored", orig);
    } catch (err) {
      console.warn("Failed restoring", f, err.message);
    }
  }
}

const repoRoot = path.resolve(__dirname, "..", "..");
restore(repoRoot);
console.log("Restore complete.");
