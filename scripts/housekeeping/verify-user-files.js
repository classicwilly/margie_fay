#!/usr/bin/env node
/*
 * Find and report large files in `public/`, `docs/`, and `foundation/`.
 * Emits a markdown report to `docs/HOUSEKEEPING_REPORT.md`.
 */

const fs = require("fs");
const path = require("path");

function walk(dir) {
  const files = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) files.push(...walk(full));
    else files.push({ path: full, size: stat.size });
  }
  return files;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let i = -1;
  do {
    bytes /= 1024;
    i++;
  } while (bytes >= 1024 && i < units.length - 1);
  return `${bytes.toFixed(1)} ${units[i]}`;
}

function main() {
  const roots = ["public", "docs", "foundation"];
  const threshold = 100 * 1024; // 100KB
  const repoRoot = path.resolve(__dirname, "..", "..");
  let report = "# Housekeeping Report\n\n";
  report += `Generated: ${new Date().toISOString()}\n\n`;
  report += `Files larger than ${formatBytes(threshold)}:\n\n`;
  let foundAny = false;
  for (const r of roots) {
    const dir = path.join(repoRoot, r);
    if (!fs.existsSync(dir)) continue;
    const files = walk(dir);
    const large = files
      .filter((f) => f.size >= threshold)
      .sort((a, b) => b.size - a.size);
    if (large.length > 0) {
      foundAny = true;
      report += `## ${r}\n\n`;
      for (const f of large) {
        report += `- ${path.relative(repoRoot, f.path)} — ${formatBytes(f.size)}\n`;
      }
      report += "\n";
    }
  }
  if (!foundAny) {
    report += "\nNo large files found.\n";
  }

  // Write the report into docs
  const outPath = path.join(repoRoot, "docs", "HOUSEKEEPING_REPORT.md");
  fs.writeFileSync(outPath, report, "utf-8");
  console.log("Housekeeping report written to docs/HOUSEKEEPING_REPORT.md");
}

main();
