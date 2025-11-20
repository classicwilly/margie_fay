/**
 * A simple codemod using string replacement. This is a fallback codemod; for complex AST changes prefer jscodeshift.
 * Usage: node transforms/replace-root-context-imports.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const patterns = [
  /from '\.\.\/contexts\//g,
  /from "\.\.\/contexts\//g,
];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
      walk(full);
    } else if (/\.tsx?$/.test(entry.name)) {
      let content = fs.readFileSync(full, 'utf8');
      const original = content;
      patterns.forEach(p => {
        content = content.replace(p, `from '../src/contexts/`);
      });
      if (content !== original) {
        fs.writeFileSync(full, content, 'utf8');
        console.log('Updated', full);
      }
    }
  }
}

console.log('Running replace-root-context-imports codemod (this is a simple codemod).');
walk(ROOT);
console.log('Done.');
