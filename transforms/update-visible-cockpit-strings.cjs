#!/usr/bin/env node
/*
  Update visible 'Cockpit' strings to 'Workshop' across UI and docs.
  Be conservative: only replace string literals within selected folders
  Usage: node transforms/update-visible-cockpit-strings.cjs
*/
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TARGET_DIRS = [
  "components",
  "src",
  "docs",
  "", // root README.md, metadata.json
];
const IGNORE = ["node_modules", "dist", ".git", "coverage"];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORE.includes(entry.name)) continue;
      walk(full);
    } else if (/\.(tsx|ts|jsx|js|md|json)$/i.test(entry.name)) {
      let content = fs.readFileSync(full, "utf8");
      const original = content;
      // Replace visible heading 'The Cockpit' -> 'The Workshop'
      content = content.replace(/The Cockpit/g, "The Workshop");
      // Replace 'Cockpit Setup Protocol' and other metadata strings
      content = content.replace(/Cockpit Setup/g, "Workshop Setup");
      // Replace 'Financial Cockpit'
      content = content.replace(/Financial Cockpit/g, "Financial Workshop");
      // Replace standalone 'Cockpit' as a visible label in comments/strings but preserve filenames and imports
      content = content.replace(
        /(['"`<\s>])Cockpit(['"`\s>.,!?])/g,
        (m, a, b) => `${a}Workshop${b}`,
      );
      if (content !== original) {
        fs.writeFileSync(full, content, "utf8");
        console.log("Updated visible cockpit -> workshop in", full);
      }
    }
  }
}

for (const dir of TARGET_DIRS) {
  const full = path.resolve(ROOT, dir || ".");
  if (fs.existsSync(full)) walk(full);
}

console.log("update-visible-cockpit-strings: Done.");
