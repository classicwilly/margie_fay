#!/usr/bin/env node
import fs from "fs";
import path from "path";

const repoDocsDir = path.resolve("c:/wonky-sprout-os/docs");
const readmePath = path.join(repoDocsDir, "MIGRATION_README.md");

if (!fs.existsSync(readmePath)) {
  console.error("MIGRATION_README.md not found at", readmePath);
  process.exit(1);
}

const content = fs.readFileSync(readmePath, "utf8");
const marker =
  "If you find any issues with this canonical document, let me know and I will adjust.";
const idx = content.indexOf(marker);
if (idx === -1) {
  console.log("Marker not found; leaving file unchanged.");
  process.exit(0);
}

// Keep the file up to the end of the marker line and the following newline, to preserve the canonical block
const markerEndIdx = idx + marker.length;
const endOfFirstBlock = content.indexOf("\n", markerEndIdx);
const newContent = content.slice(0, endOfFirstBlock + 1);

fs.writeFileSync(readmePath, newContent, "utf8");
console.log(
  "MIGRATION_README.md cleaned: only first canonical block retained.",
);
