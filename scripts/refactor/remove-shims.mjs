#!/usr/bin/env node
// remove-shims.mjs
// Detect deprecated shims and delete them if no project imports remain

import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import childProcess from "child_process";
import { Project } from "ts-morph";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");

function exec(cmd) {
  try {
    return childProcess.execSync(cmd, { cwd: repoRoot }).toString().trim();
  } catch (e) {
    return null;
  }
}

const project = new Project({
  tsConfigFilePath: path.join(repoRoot, "tsconfig.json"),
});
const sourceFiles = project.getSourceFiles();

const shimCandidates = [];
// Look for files that have the DEPRECATED SHIM comment and export from another path
for (const sf of sourceFiles) {
  const text = sf.getFullText();
  if (/DEPRECATED SHIM/i.test(text) && /export\s+\*/.test(text)) {
    shimCandidates.push(sf.getFilePath());
  }
}

if (shimCandidates.length === 0) {
  console.log("No shims found");
  process.exit(0);
}

console.log("Found shim candidates:", shimCandidates.length);
const removals = [];

for (const shim of shimCandidates) {
  // determine the export target
  const content = fs.readFileSync(shim, "utf8");
  const match = content.match(/from\s+['"]([^'"]+)['"]/m);
  if (!match) continue;
  const relTo = match[1];
  const shimDir = path.dirname(shim);
  const targetAbs = path.resolve(shimDir, relTo);

  // Search project for import references to the shim path
  const importers = [];
  for (const sf of sourceFiles) {
    const imports = sf.getImportDeclarations();
    for (const imp of imports) {
      if (
        imp.getModuleSpecifierValue() ===
        "./" + path.basename(shim).replace(/\.(tsx|ts|js|jsx)$/, "")
      ) {
        importers.push(sf.getFilePath());
      }
    }
  }

  if (importers.length === 0) {
    removals.push(shim);
  }
}

if (removals.length === 0) {
  console.log("No shims are removable yet; imports still reference them");
  process.exit(0);
}

console.log("Will remove the following shims:", removals);
// Create branch and commit removal
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const branch = `refactor/remove-shims-${timestamp}`;
exec(`git checkout -b ${branch}`);
for (const f of removals) {
  fs.unlinkSync(f);
  exec(`git add -A`);
}
exec(`git commit -m "chore(refactor): remove stale shims (${branch})"`);
const push = exec(`git push -u origin ${branch}`);
if (!push) console.warn("Push failed: run git push -u origin", branch);
else console.log("Pushed branch and ready to create PR:", branch);
