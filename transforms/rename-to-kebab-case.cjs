#!/usr/bin/env node
// transforms/rename-to-kebab-case.cjs
// Usage: node transforms/rename-to-kebab-case.cjs --apply
// By default this script does a dry-run and prints proposed renames and
// updated import lines. Use --apply to actually modify files and rename.

const fs = require("fs");
const path = require("path");
const glob = require("glob");
const args = process.argv.slice(2);
const doApply = args.includes("--apply");

function isUpperCaseLetter(c) {
  return c && c !== c.toLowerCase();
}

function camelToKebab(name) {
  // Convert PascalCase / camelCase to kebab-case
  // E.g., 'ContextSwitchRestoreModal' -> 'context-switch-restore-modal'
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function proposeFilenameMapping(filePath) {
  const dir = path.dirname(filePath);
  const base = path.basename(filePath);
  const ext = path.extname(base);
  const name = base.slice(0, -ext.length);
  // skip files that are already kebab-case
  if (name.indexOf("-") >= 0) return null;
  // If name contains any lowercase initial char, we may skip
  if (!isUpperCaseLetter(name[0])) return null;
  const newName = camelToKebab(name);
  if (newName === name) return null;
  const newFile = path.join(dir, `${newName}${ext}`);
  return { filePath, newFile };
}

function findFiles(patterns) {
  const files = new Set();
  patterns.forEach((pattern) => {
    const matches = glob.sync(pattern, { nodir: true });
    matches.forEach((m) => files.add(path.resolve(m)));
  });
  return Array.from(files);
}

function updateImports(rootDir, mapping, apply) {
  // mapping: Map<oldBaseName -> newBaseName> for path segments
  const filePatterns = ["**/*.{ts,tsx,js,jsx}"];
  const cwd = rootDir;
  const files = findFiles(filePatterns.map((p) => path.join(cwd, p)));
  const importRegex =
    /^(\s*import\s+.+?from\s+['"])(\.\/|\.\.\/).*?([\w\-]+)(['"]\s*;?)/gm;
  const importRegex2 = /^(\s*require\(['"])(\.\/|\.\.\/).*?([\w\-]+)(['"]\))/gm;
  const changes = [];
  files.forEach((f) => {
    let content = fs.readFileSync(f, "utf-8");
    let original = content;
    // Replace import paths where base filename matches key
    content = content.replace(importRegex, (m, p1, p2, base, p4) => {
      // If base includes a dot or slashes, leave alone
      const idx = base.lastIndexOf("/");
      const short = base;
      if (mapping.has(short)) {
        const newPath = p1 + p2 + content.substr(0, 0) + base;
        // we need to construct actual proper string: we don't have full path
      }
      return m;
    });
    // Use a simpler approach: iterate mapping and regex replace
    mapping.forEach((newName, oldName) => {
      // Replace occurrences like './OldName' or '../OldName'
      const re1 = new RegExp(`(['\"])(\.\/[\w\-\/]*?)(${oldName})(['\"])`, "g");
      const re2 = new RegExp(`(['\"])(\.\.[\/\w\-]*?)(${oldName})(['\"])`, "g");
      content = content.replace(
        re1,
        (m, q, pfx, base, q2) => `${q}${pfx}${newName}${q2}`,
      );
      content = content.replace(
        re2,
        (m, q, pfx, base, q2) => `${q}${pfx}${newName}${q2}`,
      );
    });
    if (content !== original) {
      changes.push({ file: f, original, updated: content });
      if (apply) fs.writeFileSync(f, content, "utf-8");
    }
  });
  return changes;
}

function main() {
  const root = path.resolve(process.cwd());
  const targetDirs = [
    ".", // root
    "components",
    "src",
    "tests",
    "components/modules",
    "src/modules",
  ];
  const patterns = targetDirs.map(
    (d) => `${path.join(root, d)}/**/*.{tsx,ts,js,jsx}`,
  );
  const files = findFiles(patterns);
  const renameMap = new Map();
  files.forEach((f) => {
    const mapping = proposeFilenameMapping(f);
    if (mapping) {
      renameMap.set(mapping.filePath, mapping.newFile);
    }
  });
  if (renameMap.size === 0) {
    console.log(
      "No PascalCase filenames found to rename under target directories.",
    );
    return;
  }
  console.log("Found", renameMap.size, "files to rename.");
  renameMap.forEach((newFile, oldFile) => {
    console.log(
      "  ",
      path.relative(root, oldFile),
      "->",
      path.relative(root, newFile),
    );
  });

  // Build a path mapping for base filename replacements (oldBase -> newBase)
  const baseMap = new Map();
  renameMap.forEach((newFile, oldFile) => {
    const oldBase = path.basename(oldFile, path.extname(oldFile));
    const newBase = path.basename(newFile, path.extname(newFile));
    baseMap.set(oldBase, newBase);
  });

  if (doApply) {
    // Apply renames
    renameMap.forEach((newFile, oldFile) => {
      const newDir = path.dirname(newFile);
      if (!fs.existsSync(newDir)) fs.mkdirSync(newDir, { recursive: true });
      fs.renameSync(oldFile, newFile);
    });
    // Update imports across repo
    const changes = updateImports(root, baseMap, true);
    console.log(`Updated ${changes.length} files to reflect new paths.`);
    console.log("Rename complete. Run tests and lint to verify changes.");
  } else {
    console.log(
      "\nDry-run mode (no files changed). Run with --apply to make changes.",
    );
    console.log("Base mapping examples (oldName -> newName):");
    let i = 0;
    for (let [k, v] of baseMap) {
      if (i++ > 200) break;
      console.log(`  ${k} -> ${v}`);
    }
    console.log("\nUse --apply to rename and update imports.");
  }
}

try {
  main();
} catch (err) {
  console.error(err);
  process.exit(1);
}
