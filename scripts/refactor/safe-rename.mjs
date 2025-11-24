#!/usr/bin/env node
/*
Safe rename tool using ts-morph
Usage:
  node scripts/refactor/safe-rename.mjs --manifest=scripts/refactor/rename-manifest.json

rename-manifest.json: [{ "from": "components/Sidebar.tsx", "to": "components/ui/sidebar.tsx" }, ...]
*/

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Project, ts } from "ts-morph";
import childProcess from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");

function log(...args) {
  console.log(...args);
}

function exec(cmd) {
  try {
    return childProcess
      .execSync(cmd, { cwd: repoRoot, stdio: "pipe" })
      .toString()
      .trim();
  } catch (err) {
    return null;
  }
}

function parseArgs() {
  const args = {};
  for (const raw of process.argv.slice(2)) {
    const [k, v] = raw.split("=");
    if (k.startsWith("--")) args[k.slice(2)] = v || true;
  }
  return args;
}

const args = parseArgs();
const manifestPath =
  args.manifest || path.join("scripts", "refactor", "rename-manifest.json");
if (!fs.existsSync(path.join(repoRoot, manifestPath))) {
  console.error("Manifest file not found:", manifestPath);
  process.exit(1);
}

const manifest = JSON.parse(
  fs.readFileSync(path.join(repoRoot, manifestPath), "utf8"),
);
if (!Array.isArray(manifest) || manifest.length === 0) {
  console.error("Manifest must be a non-empty array of {from,to} entries.");
  process.exit(1);
}

const project = new Project({
  tsConfigFilePath: path.join(repoRoot, "tsconfig.json"),
});
const renameResults = [];

function normalize(p) {
  return path.resolve(repoRoot, p).replace(/\\/g, "/");
}

function stripExt(p) {
  return p.replace(/\.(tsx|ts|jsx|js)$/, "");
}

function relativeImportPath(fromFile, toFile) {
  let rel = path.relative(path.dirname(fromFile), toFile).replace(/\\/g, "/");
  if (!rel.startsWith(".")) rel = "./" + rel;
  // Remove extension when creating import path
  rel = stripExt(rel);
  return rel;
}

for (const entry of manifest) {
  if (!entry.from || !entry.to) continue;
  const oldPath = normalize(entry.from);
  const newPath = normalize(entry.to);
  const oldExists = fs.existsSync(oldPath);
  const newExists = fs.existsSync(newPath);

  log(
    `Processing: ${entry.from} -> ${entry.to} (oldExists=${oldExists}, newExists=${newExists})`,
  );

  // If new path exists, we will just create a shim at old path that re-exports from new, and optionally remove old
  if (newExists) {
    log(
      "Destination already exists; creating shim and backing up original (if present)",
    );

    if (oldExists) {
      // Move old to backup to avoid duplicate definitions
      const backup = oldPath + ".bak-" + Date.now();
      fs.renameSync(oldPath, backup);
      log("Backed up old file to", backup);
    }
    // Create shim at oldPath
    const rel = relativeImportPath(oldPath, newPath);
    const shimSrc =
      `// DEPRECATED SHIM: ${path.relative(repoRoot, entry.from)} -> ${path.relative(repoRoot, entry.to)}\n` +
      `// This file keeps existing imports working temporarily during the migration.\n` +
      `export * from '${rel}';\nexport { default } from '${rel}';\n`;
    fs.mkdirSync(path.dirname(oldPath), { recursive: true });
    fs.writeFileSync(oldPath, shimSrc, "utf8");
    renameResults.push({
      from: oldPath,
      to: newPath,
      shimCreated: true,
      backedUp: oldExists,
    });
    continue;
  }

  // If new path doesn't exist and old exists, perform move and create shim
  if (oldExists) {
    // create new dir
    fs.mkdirSync(path.dirname(newPath), { recursive: true });
    fs.renameSync(oldPath, newPath);
    log("Moved file", oldPath, "->", newPath);

    // Now create shim at old path
    const rel = relativeImportPath(oldPath, newPath);
    const shimSrc =
      `// DEPRECATED SHIM: ${path.relative(repoRoot, entry.from)} -> ${path.relative(repoRoot, entry.to)}\n` +
      `// This file keeps existing imports working temporarily during the migration.\n` +
      `export * from '${rel}';\nexport { default } from '${rel}';\n`;
    fs.mkdirSync(path.dirname(oldPath), { recursive: true });
    fs.writeFileSync(oldPath, shimSrc, "utf8");
    renameResults.push({
      from: oldPath,
      to: newPath,
      moved: true,
      shimCreated: true,
    });
  } else {
    log("Old file does not exist. Creating stub pointing to new file");
    // Create shim at old path
    const rel = relativeImportPath(oldPath, newPath);
    const shimSrc =
      `// DEPRECATED SHIM: ${path.relative(repoRoot, entry.from)} -> ${path.relative(repoRoot, entry.to)}\n` +
      `// This file keeps existing imports working temporarily during the migration.\n` +
      `export * from '${rel}';\nexport { default } from '${rel}';\n`;
    fs.mkdirSync(path.dirname(oldPath), { recursive: true });
    fs.writeFileSync(oldPath, shimSrc, "utf8");
    renameResults.push({
      from: oldPath,
      to: newPath,
      shimCreated: true,
      createdOnly: true,
    });
  }

  // Update imports throughout the project
  const fromNoExt = stripExt(oldPath);
  const toNoExt = stripExt(newPath);

  const allSourceFiles = project.getSourceFiles();
  for (const sf of allSourceFiles) {
    const srcFilePath = sf.getFilePath().replace(/\\/g, "/");
    let madeChange = false;
    // Update import declarations
    sf.getImportDeclarations().forEach((decl) => {
      const spec = decl.getModuleSpecifierValue();
      if (!spec) return;
      const resolved = path.resolve(path.dirname(srcFilePath), spec);
      // Try to match file path ignoring extension
      if (
        resolved === fromNoExt ||
        resolved === fromNoExt + ".tsx" ||
        resolved === fromNoExt + ".ts"
      ) {
        const newRel = relativeImportPath(srcFilePath, newPath);
        decl.setModuleSpecifier(newRel);
        madeChange = true;
      }
    });
    // Update export-from declarations
    sf.getExportDeclarations().forEach((exp) => {
      const spec = exp.getModuleSpecifierValue();
      if (!spec) return;
      const resolved = path.resolve(path.dirname(srcFilePath), spec);
      if (
        resolved === fromNoExt ||
        resolved === fromNoExt + ".tsx" ||
        resolved === fromNoExt + ".ts"
      ) {
        const newRel = relativeImportPath(srcFilePath, newPath);
        exp.setModuleSpecifier(newRel);
        madeChange = true;
      }
    });
    if (madeChange) sf.saveSync();
  }
}

// Save and log results
project.saveSync();
console.log("Rename results:");
renameResults.forEach((r) => console.log(r));

// Branch, add, commit
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const branchName = `refactor/rename-batch-${timestamp}`;
const gitCheckout = exec(`git checkout -b ${branchName}`);
if (!gitCheckout)
  console.error("Failed to create branch. Are you inside a Git repo?");
else log("Created branch", branchName);

const gitAdd = exec("git add -A");
const gitCommit = exec(
  `git commit -m "chore(refactor): rename files and add shims (${branchName})"`,
);
if (!gitCommit) console.error("Failed to create commit (nothing to commit?).");
else console.log("Committed changes: ", gitCommit);

// Attempt to push
const pushResult = exec(`git push -u origin ${branchName}`);
if (!pushResult)
  console.warn(
    "Push failed or no remote configured: run `git push -u origin",
    branchName,
    "` manually.",
  );
else console.log("Pushed branch to origin/", branchName);

console.log(
  "safe-rename: Done. Please open a pull request for branch:",
  branchName,
);
