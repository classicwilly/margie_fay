#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { sync as glob } from "glob";

const repoRoot = path.resolve(".");
const files = glob("**/*.{md,MD,markdown}").filter(
  (p) => !p.includes("node_modules") && !p.includes(".git"),
);

let errors = 0;
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/);
  lines.forEach((line, idx) => {
    const lower = line.toLowerCase();
    if (lower.includes("grandma") && line.includes("WWGD ")) {
      console.error(
        `${file}:${idx + 1}: Found 'Grandma' together with 'WWGD' (use 'WWGDma' for Grandma)`,
      );
      errors++;
    }
    if (lower.includes("grandpa") && line.includes("WWGDma")) {
      console.error(
        `${file}:${idx + 1}: Found 'Grandpa' together with 'WWGDma' (use 'WWGD' for Grandpa)`,
      );
      errors++;
    }
  });
}
if (errors) {
  console.error(`Found ${errors} heuristic acronym errors.`);
  process.exitCode = 2;
} else {
  console.log("No heuristic acronym errors found.");
}
