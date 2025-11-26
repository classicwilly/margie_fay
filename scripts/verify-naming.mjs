#!/usr/bin/env node
// verify-naming.mjs -- ESM
// Verifies kebab-case filenames and PascalCase component exports for TSX files.

import path from "path";
import { fileURLToPath } from "url";
import { Project } from "ts-morph";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tsconfigPath = path.join(__dirname, "..", "tsconfig.json");
const project = new Project({ tsConfigFilePath: tsconfigPath });
const repoRoot = path.resolve(__dirname, "..");

function isKebabCase(name) {
  return /^[a-z][a-z0-9-]*$/.test(name);
}

function kebabToPascal(kebab) {
  return kebab
    .split("-")
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
    .join("");
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
  sourceFiles = project.getSourceFiles([
    "components/**/*.{tsx,ts}",
    "src/**/*.{tsx,ts}",
  ]);
}

for (const sf of sourceFiles) {
  const filePath = sf.getFilePath();
  const ext = path.extname(filePath).toLowerCase();
  if (![".tsx", ".ts"].includes(ext)) continue;

  const filename = path.basename(filePath);
  const base = filename.replace(ext, "");
  // Special-case `.d.ts` declaration file names: filename is like 'global.d.ts'
  // so strip the '.d' part before applying kebab-case checks.
  const isDtsDeclaration = filename.endsWith(".d.ts");
  const normalizedBase = isDtsDeclaration ? base.replace(/\.d$/, "") : base;
  const isModule = base.endsWith(".module");
  const namePart = isModule
    ? normalizedBase.replace(/\.module$/, "")
    : normalizedBase;
  // If filename includes a dot suffix like '.clean', remove it for the
  // purposes of expectation checks - e.g. 'CommandCenter.clean' -> 'CommandCenter'
  const namePartNormalized = namePart.replace(/\.[a-z0-9]+$/i, "");

  // Allow PascalCase filenames in certain directories to support
  // React component naming and some context/service file naming patterns
  // commonly used in this repo. Many other files should still use kebab-case
  // (e.g., scripts, modules, utilities).
  const rel = path.relative(repoRoot, filePath).replace(/\\/g, "/");
  const allowedPascalDirs = [
    "components/",
    "src/components/",
    "src/context/",
    "src/integrations/",
    "src/utils/",
    "src/contexts/",
    "src/views/",
    "src/modules/",
    "src/services/",
    "src/hooks/",
    "src/sops/",
  ];
  const underPascalAllowedDir = allowedPascalDirs.some((d) =>
    rel.startsWith(d),
  );
  if (!underPascalAllowedDir && !isKebabCase(namePart)) {
    errors.push(
      `ERROR: ${filePath} -> filename part must be kebab-case. Found '${namePart}'`,
    );
    continue;
  }

  if (ext === ".tsx") {
    const expected = kebabToPascal(namePartNormalized);
    const exportSymbols = sf
      .getExportSymbols()
      .map((s) => s.getName())
      .filter(Boolean);
    const defExport = sf.getDefaultExportSymbol();
    if (defExport && defExport.getName && defExport.getName()) {
      exportSymbols.push(defExport.getName());
    }

    const pascalExports = exportSymbols.filter((n) =>
      /^[A-Z][A-Za-z0-9]+$/.test(n),
    );
    // If the file is in a component directory, expect an exported component
    // that matches the Pascal expected name exactly. For files in other
    // allowed directories like contexts/providers/services, accept exported
    // symbols that include the expected base name (e.g. OscilloscopeProvider,
    // useOscilloscope).
    const isComponentDir =
      rel.startsWith("components/") || rel.startsWith("src/components/");
    const isContextDir =
      rel.startsWith("src/contexts/") || rel.startsWith("src/context/");
    if (pascalExports.length > 0) {
      if (isComponentDir) {
        if (!exportSymbols.includes(expected)) {
          errors.push(
            `ERROR: ${filePath} -> expected exported component '${expected}', found: [${exportSymbols.join(", ")}]`,
          );
        }
      } else if (underPascalAllowedDir) {
        // If this is a contexts directory, be more permissive and don't require
        // an exact export to match the filename - these files commonly export
        // Provider / hooks / short-named symbols.
        if (isContextDir) {
          continue; // allow any exports
        }
        // derive a base token from the expected, removing common suffixes
        const baseSegment = expected.replace(
          /(Provider|Context|Module|View|Component|Hook|Hooks|Sop|Service)$/,
          "",
        );
        const hasMatch = exportSymbols.some(
          (s) => s && s.includes(baseSegment),
        );
        if (!hasMatch) {
          errors.push(
            `ERROR: ${filePath} -> expected exported symbols including base '${baseSegment}', found: [${exportSymbols.join(", ")}]`,
          );
        }
      } else {
        // default behavior: expect the exact expected name
        if (!exportSymbols.includes(expected)) {
          errors.push(
            `ERROR: ${filePath} -> expected exported component '${expected}', found: [${exportSymbols.join(", ")}]`,
          );
        }
      }
    }
  }
}

if (errors.length > 0) {
  console.error("Naming verification failed:");
  errors.forEach((e) => console.error(" - " + e));
  process.exit(1);
}

console.log("verify-naming: OK");
process.exit(0);
