#!/usr/bin/env node
/*
  Codemod to replace literal 'cockpit' view tokens to 'workshop' across the codebase.
  Caution: This changes view strings and test references but preserves file names and comments.
  Usage: node transforms/replace-cockpit-to-workshop.cjs
*/
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const IGNORE = [
  "node_modules",
  "dist",
  ".git",
  "coverage",
  "playwright-report",
  "tests/e2e",
];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORE.includes(entry.name)) continue;
      walk(full);
    } else if (/\.(tsx|ts|jsx|js|json)$/i.test(entry.name)) {
      let content = fs.readFileSync(full, "utf8");
      let original = content;
      // 1) Replace view: 'cockpit' -> view: 'workshop'
      content = content.replace(
        /view\s*:\s*('|")cockpit('|")/g,
        (m, q1, q2) => `view: ${q1}workshop${q2}`,
      );
      // 2) Replace view === 'cockpit' -> view === 'workshop'
      content = content.replace(
        /(===|==)\s*('|")cockpit('|")/g,
        (m, op, q1, q2) => `${op} ${q1}workshop${q2}`,
      );
      // 3) Replace strings 'cockpit' -> 'workshop' when used as a literal in quotes, not in file names or import paths
      content = content.replace(
        /('|")cockpit('|")/g,
        (m, q1, q2) => `${q1}workshop${q2}`,
      );
      if (content !== original) {
        fs.writeFileSync(full, content, "utf8");
        console.log("Replaced cockpit -> workshop in", full);
      }
    }
  }
}

walk(ROOT);
console.log("replace-cockpit-to-workshop: Done.");
