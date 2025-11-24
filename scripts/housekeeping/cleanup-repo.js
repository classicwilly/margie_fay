#!/usr/bin/env node
/*
 * Cleanup script: backup/disable legacy ESLint/Prettier config files and
 * report files that may cause conflicts with the flat eslint config.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function findFiles(root, patterns) {
  const results = [];
  const entries = fs.readdirSync(root, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(root, e.name);
    if (e.isDirectory()) {
      results.push(...findFiles(full, patterns));
    } else {
      for (const p of patterns) {
        if (full.endsWith(p)) results.push(full);
      }
    }
  }
  return results;
}

function backupAndDisable(filePath) {
  const bak = `${filePath}.disabled`;
  if (fs.existsSync(bak)) return;
  console.log(`Disabling legacy config: ${filePath} -> ${bak}`);
  fs.copyFileSync(filePath, bak);
  // Delete the original to prevent ESLint picking it up
  fs.unlinkSync(filePath);
}

function main() {
  const repoRoot = path.resolve(__dirname, "..", "..");
  const patterns = [
    ".eslintrc",
    ".eslintrc.json",
    ".eslintrc.cjs",
    ".prettierrc",
    ".prettierrc.js",
    ".prettierrc.json",
    ".eslintignore",
    ".eslintrc.yaml",
  ];

  const files = findFiles(repoRoot, patterns);
  if (files.length === 0) {
    console.log("No legacy lint/format configurations found.");
  } else {
    for (const f of files) {
      try {
        backupAndDisable(f);
      } catch (err) {
        console.warn("Failed to disable", f, err.message);
      }
    }
  }

  console.log(
    "\nRunning basic housekeeping: format, lint fix, and name verification.",
  );
  try {
    execSync("npm run format", { stdio: "inherit" });
  } catch (err) {
    console.warn("Formatting failed:", err.message);
  }
  try {
    execSync("npm run lint:fix --silent", { stdio: "inherit" });
  } catch (err) {
    console.warn("Lint fix failed:", err.message);
  }
  try {
    execSync("node ./scripts/verify-naming.js", { stdio: "inherit" });
  } catch (err) {
    console.warn("verify-naming failed:", err.message);
  }

  console.log("\nCleanup complete.");
}

main();
