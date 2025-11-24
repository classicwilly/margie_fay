#!/usr/bin/env node
// verify-naming.js
// Verifies that file names are kebab-case and exported component names match PascalCase.

const path = require("path");
const { Project } = require("ts-morph");

const project = new Project({
  tsConfigFilePath: path.resolve(__dirname, "..", "tsconfig.json"),
});

function isKebabCase(name) {
  return /^[a-z][a-z0-9-]*$/.test(name);
}

function toPascalCase(kebab) {
  return kebab
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

const failures = [];

const srcFiles = project.getSourceFiles([
  "components/**/*.{ts,tsx,js,jsx}",
  "src/**/*.{ts,tsx,js,jsx}",
]);

for (const sf of srcFiles) {
  const filePath = sf.getFilePath();
  const ext = path.extname(filePath).toLowerCase();
  const base = path.basename(filePath, ext);
  const isModule = base.endsWith(".module");
  const checkBase = isModule ? base.replace(/\.module$/, "") : base;

  if (!isKebabCase(checkBase)) {
    failures.push(`${filePath} -> filename must be kebab-case (or *.module)`);
    continue;
  }

  if (ext === ".tsx" || ext === ".jsx") {
    const expected = toPascalCase(checkBase);
    const defaultExport = sf.getDefaultExportSymbol();
    let exported = sf
      .getExportSymbols()
      .map((s) => s.getName())
      .filter(Boolean);
    if (defaultExport && defaultExport.getName && defaultExport.getName())
      exported.push(defaultExport.getName());
    const pascalExports = exported.filter((n) => /^[A-Z][A-Za-z0-9]+$/.test(n));
    if (pascalExports.length > 0 && !exported.includes(expected)) {
      failures.push(
        `${filePath} -> expected exported component '${expected}', found: [${exported.join(", ")}]`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error("verify-naming: failed");
  failures.forEach((f) => console.error(" - " + f));
  process.exit(1);
}

console.log("verify-naming: OK");
process.exit(0);
