#!/usr/bin/env node
/*
  Remove duplicate data-workshop-testid attributes added by previous codemods.
  Usage: node transforms/cleanup-duplicate-workshop-attributes.cjs
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
];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORE.includes(entry.name)) continue;
      walk(full);
    } else if (/\.(tsx|ts|jsx|js|json|md)$/i.test(entry.name)) {
      let content = fs.readFileSync(full, "utf8");
      const original = content;
      // Find sequences of repeated data-workshop-testid attributes and compress them to unique set
      content = content.replace(
        /(data-workshop-testid=\"workshop-[\w-]+\"\s*)+/g,
        (m) => {
          const uniques = new Set(m.trim().split(/\s+/));
          return Array.from(uniques).join(" ") + " ";
        },
      );
      // Also address if both single-quoted and double-quoted variants were applied
      content = content.replace(
        /(data-workshop-testid=\'workshop-[\w-]+\'\s*)+/g,
        (m) => {
          const uniques = new Set(m.trim().split(/\s+/));
          return Array.from(uniques).join(" ") + " ";
        },
      );

      if (content !== original) {
        fs.writeFileSync(full, content, "utf8");
        console.log("Cleaned duplicates in", full);
      }
    }
  }
}

walk(ROOT);
console.log("cleanup-duplicate-workshop-attributes: Done.");
