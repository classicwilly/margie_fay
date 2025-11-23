#!/usr/bin/env node
// verify-naming.js -- Clean single script
// Verifies kebab-case filenames and PascalCase component exports for TSX files.

const path = require('path');
const { Project } = require('ts-morph');

const tsconfigPath = path.join(__dirname, '..', 'tsconfig.json');
const project = new Project({ tsConfigFilePath: tsconfigPath });

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

// Scope checks: components and src only
const sourceFiles = project.getSourceFiles(['components/**/*.{tsx,ts}', 'src/**/*.{tsx,ts}']);

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
#!/usr/bin/env node
// verify-naming.js
// Verifies kebab-case filenames and PascalCase component exports for TSX files.

const path = require('path');
const { Project } = require('ts-morph');

const tsconfigPath = path.join(__dirname, '..', 'tsconfig.json');
const project = new Project({ tsConfigFilePath: tsconfigPath });

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

// Check paths in components and src
const sourceFiles = project.getSourceFiles(['components/**/*.{tsx,ts}', 'src/**/*.{tsx,ts}']);

for (const sf of sourceFiles) {
  const filePath = sf.getFilePath();
  const ext = path.extname(filePath).toLowerCase();
  if (!['.tsx', '.ts'].includes(ext)) continue;

  const filename = path.basename(filePath);
  const base = filename.replace(ext, ''); // e.g. "cockpit-navigation" or "critical-tasks.module"
  const isModule = base.endsWith('.module');
  const namePart = isModule ? base.replace(/\.module$/, '') : base;

  if (!isKebabCase(namePart)) {
    errors.push(`ERROR: ${filePath} -> filename part must be kebab-case. Got: '${namePart}'.`);
    continue;
  }

  if (ext === '.tsx') {
    const expected = kebabToPascal(namePart);
    const exportNames = sf.getExportSymbols().map((s) => s.getName()).filter(Boolean);
    const defaultExport = sf.getDefaultExportSymbol();
    if (defaultExport && defaultExport.getName && defaultExport.getName()) {
      exportNames.push(defaultExport.getName());
    }
    const pascalExports = exportNames.filter((n) => /^[A-Z][A-Za-z0-9]+$/.test(n));
    if (pascalExports.length > 0 && !exportNames.includes(expected)) {
      errors.push(`ERROR: ${filePath} -> exported component name mismatch. Expected '${expected}', found [${exportNames.join(', ')}]`);
    }
  }
}

if (errors.length > 0) {
  console.error('Naming verification failed:\n');
  errors.forEach((e) => console.error(e));
  process.exit(1);
}

console.log('verify-naming: OK');
process.exit(0);
#!/usr/bin/env node
// verify-naming.js
// Verifies that file names are kebab-case and that component names are PascalCase
// Uses ts-morph for AST parsing

const path = require('path');
const { Project } = require('ts-morph');

const tsconfig = path.join(__dirname, '..', 'tsconfig.json');
const project = new Project({ tsConfigFilePath: tsconfig });

function isKebabCase(name) {
  return /^[a-z][a-z0-9-]*$/.test(name);
}

function kebabToPascal(kebab) {
  return kebab
    .split('-')
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
    .join('');
}

const failures = [];

// Only check .tsx files in components and src modules
const sourceFiles = project.getSourceFiles(['components/**/*.tsx', 'src/**/*.tsx', 'components/**/*.ts', 'src/**/*.ts']);

for (const sf of sourceFiles) {
  const filePath = sf.getFilePath();
  const ext = path.extname(filePath).toLowerCase();
  if (!ext || !['.tsx', '.ts'].includes(ext)) continue;

  const filename = path.basename(filePath);
  const withoutExt = filename.replace(ext, '');

  // If it's a module file like 'critical-tasks.module.tsx', extract 'critical-tasks'
  const isModule = withoutExt.endsWith('.module');
  const baseName = isModule ? withoutExt.replace(/\.module$/, '') : withoutExt;

  if (!isKebabCase(baseName)) {
    failures.push(`${filePath} => filename must be kebab-case (eg. my-component.tsx or my-component.module.tsx)`);
    continue;
  }

  // For tsx files, check export name matches expected PascalCase
  if (ext === '.tsx') {
    const expectedName = kebabToPascal(baseName);
    let exportedNames = sf.getExportSymbols().map((s) => s.getName()).filter(Boolean);
    const defaultExport = sf.getDefaultExportSymbol();
    if (defaultExport && defaultExport.getName && defaultExport.getName()) {
      exportedNames.push(defaultExport.getName());
    }

    // If any PascalCased exports exist, we will enforce the expected name exists among them
    const pascalExports = exportedNames.filter((n) => /^[A-Z][A-Za-z0-9]+$/.test(n));
    if (pascalExports.length > 0 && !exportedNames.includes(expectedName)) {
      failures.push(`${filePath} => expected exported component named '${expectedName}', found exports: [${exportedNames.join(', ')}]`);
    }
  }
}

if (failures.length > 0) {
  console.error('Naming verification failed:');
  failures.forEach((f) => console.error(' - ' + f));
  process.exit(2);
}

console.log('verify-naming: OK');
process.exit(0);
#!/usr/bin/env node
// verify-naming.js
// Verifies that file names are kebab-case and that component names are PascalCase
// Usage: node scripts/verify-naming.js

const { Project, SyntaxKind } = require('ts-morph');
const path = require('path');
const fs = require('fs');

const project = new Project({ tsConfigFilePath: path.resolve(__dirname, '..', 'tsconfig.json') });

function isKebabCase(name) {
  return /^[a-z][a-z0-9-]*$/.test(name);
}

function toPascalCase(kebab) {
  return kebab
    .split('-')
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
    .join('');
}

const failures = [];

project.getSourceFiles().forEach((sf) => {
  const filePath = sf.getFilePath();
  const ext = path.extname(filePath).toLowerCase();
  if (!['.tsx', '.ts', '.jsx', '.js'].includes(ext)) return;

  const base = path.basename(filePath, ext); // e.g. cockpit-navigation
  const isModule = base.endsWith('.module') || base.endsWith('.module.tsx');
  const checkBase = isModule ? base.replace(/\.module$/, '') : base;

  const allowed = checkBase && (isKebabCase(checkBase) || isModule);
  if (!allowed) {
    failures.push(`${filePath} -> invalid file name (should be kebab-case, or *.module.tsx)`);
  }

  // Component name checks for TSX files
  if (ext === '.tsx') {
    const defaultExport = sf.getDefaultExportSymbol();
    const expectedName = toPascalCase(checkBase || base);
    // If there's a default export and it's a variable or function, try to match
    if (defaultExport) {
      const decls = defaultExport.getDeclarations();
      if (decls && decls.length > 0) {
        const decl = decls[0];
        const name = decl.getName && decl.getName();
        if (name && name !== expectedName) {
          failures.push(`${filePath} -> default export name '${name}' doesn't match expected PascalCase '${expectedName}'`);
        }
      }
    } else {
      // if no default export, check if a named export matches the expected name
      const named = sf.getExportSymbols().some((s) => s.getName() === expectedName);
      if (!named) {
        // Allow React fragments or files that don't export a component
        // To keep it simple, we only require components to match if a PascalCase symbol is present
        const allExports = sf.getExportSymbols().map((s) => s.getName());
        const hasPascal = allExports.some((n) => /^[A-Z][a-zA-Z0-9]+$/.test(n));
        if (hasPascal && !allExports.includes(expectedName)) {
          failures.push(`${filePath} -> named export mismatch; expected '${expectedName}' to be exported`);
        }
      }
    }
  }
});

if (failures.length > 0) {
  console.error('Naming verification failed:');
  failures.forEach((f) => console.error(' - ' + f));
  process.exit(2);
}

console.log('verify-naming: OK');
process.exit(0);
const { Project } = require('ts-morph');
const path = require('path');
const fs = require('fs');

const project = new Project({
  tsConfigFilePath: path.join(__dirname, '../tsconfig.json'),
});

const errors = [];

// Helper to convert PascalCase to kebab-case
function pascalToKebab(name) {
  return name.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

function verifyFile(filePath) {
  const sourceFile = project.getSourceFile(filePath);
  if (!sourceFile) return;

  const fileName = path.basename(filePath);
  const dirName = path.basename(path.dirname(filePath));
  const baseName = fileName.split('.')[0];
  const componentName = baseName.replace(/-(\w)/g, (match, p1) => p1.toUpperCase()).replace(/^[a-z]/, (match) => match.toUpperCase());

  // Rule 1: Modules under components/modules must end with .module.tsx and be kebab-case
  if (filePath.includes('components/modules/')) {
    if (!fileName.endsWith('.module.tsx')) {
      errors.push(`ERROR: Module file \`${filePath}\` must end with \`.module.tsx\`.`);
    }
    if (pascalToKebab(baseName) !== baseName) {
        errors.push(`ERROR: Module file \`${filePath}\` must be kebab-case.`);
    }
  }

  // Rule 2: PascalCase component name inside matches expected naming derived from filename
  let foundExportedComponent = false;
  sourceFile.forEachChild(node => {
    if (node.isKind('VariableStatement') || node.isKind('FunctionDeclaration')) {
      const declaration = node.getDeclarations()[0];
      if (declaration && declaration.getName() === componentName) {
        if (node.isExported()) {
          foundExportedComponent = true;
        }
      }
    }
  });

  if (!foundExportedComponent) {
    errors.push(`ERROR: File \`${filePath}\`: Expected exported component named \`${componentName}\`.`);
  }
}

// Find all .tsx files in src/components and src/modules
const componentDir = path.join(__dirname, '../components');
const modulesDir = path.join(__dirname, '../src/modules');

function collectTsxFiles(dir) {
  let tsxFiles = [];
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
      const fullPath = path.join(dir, dirent.name);
      if (dirent.isDirectory()) {
        tsxFiles = tsxFiles.concat(collectTsxFiles(fullPath));
      } else if (dirent.isFile() && dirent.name.endsWith('.tsx')) {
        tsxFiles.push(fullPath);
      }
    });
  }
  return tsxFiles;
}

const allTsxFiles = collectTsxFiles(componentDir).concat(collectTsxFiles(modulesDir));

allTsxFiles.forEach(verifyFile);

if (errors.length > 0) {
  errors.forEach(err => console.error(err));
  process.exit(1);
} else {
  console.log('Naming conventions verified successfully.');
}
