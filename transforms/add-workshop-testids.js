#!/usr/bin/env node
/*
  Simple codemod to add data-workshop-testid attributes corresponding to data-testid="cockpit-*".
  Usage: node transforms/add-workshop-testids.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const IGNORE = ['node_modules', 'dist', '.git', 'coverage', 'playwright-report'];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORE.includes(entry.name)) continue;
      walk(full);
    } else if (/\.(tsx|ts|jsx|js)$/i.test(entry.name)) {
      let content = fs.readFileSync(full, 'utf8');
      let original = content;
      // 1) plain string case: data-testid="cockpit-foo" -> add data-workshop-testid="workshop-foo"
      content = content.replace(/data-testid=("|')cockpit-([\w-]+)\1/g, (m, quote, id) => {
        // if workshop testid already exists, skip
        if (m.includes('data-workshop-testid=')) return m;
        const attr = ` data-workshop-testid=${quote}workshop-${id}${quote}`;
        return `${m}${attr}`;
      });
      // 2) template literal case: data-testid={`cockpit-${stack.id}`} data-workshop-testid={`workshop-${stack.id}`} data-workshop-testid={`workshop-${stack.id}`} data-workshop-testid={`workshop-${stack.id}`}
      // 2) template literal case: data-testid={`cockpit-${stack.id}`}
      content = content.replace(/data-testid=\{\s*`cockpit-([^`]*)`\s*\}/g, (m, inner) => {
        if (m.includes('data-workshop-testid=')) return m;
        const workshop = ` data-workshop-testid={\`workshop-${inner}\`}`;
        return `${m}${workshop}`;
      });
      // 3) other template expression with variable concatenation: data-testid={'cockpit-'+id}
      // 3) concatenated template case: data-testid={'cockpit-'+id} -> add data-workshop-testid={`workshop-${id}`}
      content = content.replace(/data-testid=\{\s*'cockpit-'\s*\+\s*([^}]+)\s*\}/g, (m, expr) => {
        if (m.includes('data-workshop-testid=')) return m;
        const workshopExpr = ` data-workshop-testid={\`workshop-\${${expr}}\`}`;
        return `${m}${workshopExpr}`;
      });

      if (content !== original) {
        fs.writeFileSync(full, content, 'utf8');
        console.log('Updated', full);
      }
    }
  }
}

walk(ROOT);
console.log('add-workshop-testids: Done.');
