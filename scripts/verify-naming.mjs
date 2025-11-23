#!/usr/bin/env node
// verify-naming.mjs -- ESM
// Verifies kebab-case filenames and PascalCase component exports for TSX files.

import path from 'path';
import { fileURLToPath } from 'url';
import { Project } from 'ts-morph';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tsconfigPath = path.join(__dirname, '..', 'tsconfig.json');
const project = new Project({ tsConfigFilePath: tsconfigPath });
const repoRoot = path.resolve(__dirname, '..');

function isKebabCase(name) {
  return /^[a-z][a-z0-9-]*$/.test(name);
}

function kebabToPascal(kebab) {
  return kebab
    .split('-')
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
    .join('');
}

const errors = [];

const cliFiles = process.argv.slice(2);
let sourceFiles;
if (cliFiles.length > 0) {
  sourceFiles = [];
  for (const f of cliFiles) {
    const p = path.resolve(repoRoot, f);
    const sf = project.getSourceFile(p);
    if (sf) sourceFiles.push(sf);
  }
} else {
  sourceFiles = project.getSourceFiles(['components/**/*.{tsx,ts}', 'src/**/*.{tsx,ts}']);
}

for (const sf of sourceFiles) {
  const filePath = sf.getFilePath();
  const ext = path.extname(filePath).toLowerCase();
  if (!['.tsx', '.ts'].includes(ext)) continue;

  const filename = path.basename(filePath);
  const base = filename.replace(ext, '');
  const isModule = base.endsWith('.module');
  const namePart = isModule ? base.replace(/\.module$/, '') : base;

  if (!isKebabCase(namePart)) {
    errors.push(`ERROR: ${filePath} -> filename part must be kebab-case. Found '${namePart}'`);
    continue;
  }

  if (ext === '.tsx') {
    const expected = kebabToPascal(namePart);
    const exportSymbols = sf.getExportSymbols().map((s) => s.getName()).filter(Boolean);
    const defExport = sf.getDefaultExportSymbol();
    if (defExport && defExport.getName && defExport.getName()) {
      exportSymbols.push(defExport.getName());
    }

    const pascalExports = exportSymbols.filter((n) => /^[A-Z][A-Za-z0-9]+$/.test(n));
    if (pascalExports.length > 0 && !exportSymbols.includes(expected)) {
      errors.push(`ERROR: ${filePath} -> expected exported component '${expected}', found: [${exportSymbols.join(', ')}]`);
    }
  }
}

if (errors.length > 0) {
  console.error('Naming verification failed:');
  errors.forEach((e) => console.error(' - ' + e));
  process.exit(1);
}

console.log('verify-naming: OK');
process.exit(0);
