#!/usr/bin/env node
/*
  Migrate E2E tests to prefer workshop test IDs and use the locator helper
  Usage: node transforms/update-e2e-locators.cjs
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TESTS_DIR = path.join(ROOT, 'tests', 'e2e');
const IGNORE = ['node_modules', 'dist', '.git', 'coverage'];

function addImportIfMissing(full, content, imp) {
  if (content.includes(imp)) return content;
  const lines = content.split('\n');
  // find first import statement or top-of-file location
  let idx = 0;
  while (idx < lines.length && lines[idx].trim().startsWith('import')) idx++;
  lines.splice(idx, 0, imp);
  return lines.join('\n');
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORE.includes(entry.name)) continue;
      walk(full);
    } else if (/\.(tsx|ts|jsx|js)$/i.test(entry.name)) {
      let content = fs.readFileSync(full, 'utf8');
      const original = content;

      // Replace page.getByTestId('workshop-foo') or page.getByTestId('cockpit-foo')
      // with page.locator(byWorkshopOrCockpitTestId('workshop-foo'))
      content = content.replace(/page\.getByTestId\((['\"])cockpit-([\w\d${}.-]+)\1\)/g, (m, q1, id) => {
        return `page.locator(byWorkshopOrCockpitTestId('workshop-${id}'))`;
      });
      content = content.replace(/page\.getByTestId\((['\"])workshop-([\w\d${}.-]+)\1\)/g, (m, q1, id) => {
        return `page.locator(byWorkshopOrCockpitTestId('workshop-${id}'))`;
      });

      // Replace page.$('[data-testid="cockpit-foo"]') or selectors that query cockpit test id
      content = content.replace(/page\.\$(\(['\"])\[data-testid=\\\"cockpit-([\w-]+)\\\"\]\\\1\)/g, (m, q1, id) => {
        return `page.locator(byWorkshopOrCockpitTestId('workshop-${id}'))`;
      });

      // Replace nav-cockpit references with nav-workshop preferring new id but keeping fallback code
      content = content.replace(/\[data-testid=\"nav-cockpit\"\]/g, `\[data-workshop-testid=\"nav-workshop\"\], [data-testid=\"nav-cockpit\"]`);

      // Ensure the helper import is present when we replaced getByTestId / $ with locator helper
      if (content !== original && content.includes('byWorkshopOrCockpitTestId')) {
        // Add import - detection: if file already imports it from ./helpers/locators
        const neededImport = `import { byWorkshopOrCockpitTestId } from './helpers/locators';`;
        content = addImportIfMissing(full, content, neededImport);
      }

      if (content !== original) {
        fs.writeFileSync(full, content, 'utf8');
        console.log('Updated e2e test locators:', full);
      }
    }
  }
}

walk(TESTS_DIR);
console.log('update-e2e-locators: Done.');
