#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const resultsPath = path.resolve(
  process.cwd(),
  "playwright-axe-results/axe-results.json",
);

if (!fs.existsSync(resultsPath)) {
  console.error("[parse-axe] No axe results file at", resultsPath);
  process.exit(2);
}

const raw = fs.readFileSync(resultsPath, "utf8");
let parsed;
try {
  parsed = JSON.parse(raw);
} catch (e) {
  console.error("[parse-axe] Failed to parse JSON", e.message);
  process.exit(3);
}

const violations = parsed.violations || [];

if (violations.length === 0) {
  console.log("[parse-axe] No violations found in Axe output.");
  process.exit(0);
}

console.log(
  "[parse-axe] Found",
  violations.length,
  "violations in axe-results.json",
);

const grouped = violations.reduce((acc, v) => {
  acc[v.impact] = acc[v.impact] || [];
  acc[v.impact].push(v);
  return acc;
}, {});

["critical", "serious", "moderate", "minor"].forEach((impact) => {
  const arr = grouped[impact] || [];
  if (arr.length) {
    console.log(
      `\n[parse-axe] Impact: ${impact} -> ${arr.length} violation(s)`,
    );
    arr.forEach((violation) => {
      console.log(
        `- id: ${violation.id}, nodes: ${violation.nodes.length}, description: ${violation.help}`,
      );
      violation.nodes.slice(0, 3).forEach((node, idx) => {
        console.log(`  - node[${idx}]: target=${(node.target || []).slice(0, 3).join(", ")}
    html: ${node.html ? node.html.substring(0, 200) : "n/a"}`);
      });
    });
  }
});

// Fail if any critical or serious violations
const critical = grouped["critical"] || [];
const serious = grouped["serious"] || [];

if (critical.length || serious.length) {
  console.error(
    `\n[parse-axe] Failing: ${critical.length} critical and ${serious.length} serious violations found.`,
  );
  process.exit(1);
}

console.log("\n[parse-axe] No critical/serious violations.");
process.exit(0);
