#!/usr/bin/env node
/*
  Simple codemod to add data-workshop-testid attributes corresponding to data-testid="cockpit-*".
  Usage: node transforms/add-workshop-testids.cjs
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
    } else if (/\.(tsx|ts|jsx|js)$/i.test(entry.name)) {
      let content = fs.readFileSync(full, "utf8");
      let original = content;
      // 1) plain string case: data-testid="cockpit-foo"
      content = content.replace(
        /data-testid=("|')cockpit-([\w-]+)\1/g,
        (m, quote, id) => {
          const attr = `data-workshop-testid=${quote}workshop-${id}${quote}`;
          if (m.includes("data-workshop-testid=")) return m; // exists
          return `${m} ${attr}`;
        },
      );
      // 2) template literal case: data-testid={`cockpit-${stack.id}`}
      content = content.replace(
        /data-testid=\{\s*`cockpit-([^`]*)`\s*\}/g,
        (m, inner) => {
          const workshop = `data-workshop-testid={\`workshop-${inner}\`}`;
          if (m.includes("data-workshop-testid=")) return m;
          return `${m} ${workshop}`;
        },
      );
      // 3) other template expression with variable concatenation: data-testid={'cockpit-'+id}
      content = content.replace(
        /data-testid=\{\s*('|\")cockpit-\'\s*\+\s*([^}]+)\s*\1\}/g,
        (m, quote, expr) => {
          // this is a rough heuristic; inject workshop dynamic expression as well
          const workshopExpr = `data-workshop-testid={\`workshop-\${${expr}}\`}`;
          if (m.includes("data-workshop-testid=")) return m;
          return `${m} ${workshopExpr}`;
        },
      );

      if (content !== original) {
        fs.writeFileSync(full, content, "utf8");
        console.log("Updated", full);
      }
    }
  }
}

walk(ROOT);
console.log("add-workshop-testids: Done.");
