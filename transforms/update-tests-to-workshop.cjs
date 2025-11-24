#!/usr/bin/env node
/*
  Replace test selectors in tests to prefer workshop-* rather than cockpit-*.
  Usage: node transforms/update-tests-to-workshop.cjs
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TESTS_DIR = path.join(ROOT, 'tests');
const IGNORE = ['node_modules', 'dist', '.git', 'coverage'];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORE.includes(entry.name)) continue;
      walk(full);
    } else if (/\.(tsx|ts|jsx|js)$/i.test(entry.name)) {
      if (!full.startsWith(TESTS_DIR)) continue; // only update tests
      let content = fs.readFileSync(full, 'utf8');
      let original = content;
      // Replace getByTestId("cockpit-...") to getByTestId("workshop-...")
      content = content.replace(/getByTestId\(("|')cockpit-([\w-\d${}.]+)("|')\)/g, (m, q1, id, q2) => `getByTestId(${q1}workshop-${id}${q2})`);
      content = content.replace(/page.getByTestId\(("|')cockpit-([\w-\d${}.]+)("|')\)/g, (m, q1, id, q2) => `page.getByTestId(${q1}workshop-${id}${q2})`);
      content = content.replace(/\[data-testid=("|')cockpit-([\w-]+)\1\]/g, (m, q, id) => `[data-testid="workshop-${id}"]`);
      // Also replace nav-cockpit to nav-workshop
      content = content.replace(/nav-cockpit/g, 'nav-workshop');
      // Replace 'Cockpit' header text references if used for visible text checks (CASE: The Cockpit)
      content = content.replace(/The Cockpit/g, 'The Workshop');
      content = content.replace(/Cockpit/g, 'Workshop');
      if (content !== original) {
        fs.writeFileSync(full, content, 'utf8');
        console.log('Updated test:', full);
      }
    }
  }
}

walk(TESTS_DIR);
console.log('update-tests-to-workshop: Done.');
