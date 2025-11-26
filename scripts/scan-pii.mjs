#!/usr/bin/env node
import fs from "fs";
import path from "path";

const ignored = [
  "node_modules",
  ".git",
  "coverage",
  "dist",
  "dist-ssr",
  "playwright-report",
  "test-results",
  "scripts",
];
const fileExtensions = [
  ".js",
  ".ts",
  ".tsx",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".env",
  ".yaml",
  ".yml",
];

const patterns = [
  { name: "OpenAI-like sk-", regex: /sk-[a-zA-Z0-9]{32,}/g },
  { name: "Google API Key", regex: /AIzaSy[a-zA-Z0-9_-]{33}/g },
  { name: "Private Key Begin", regex: /-----BEGIN PRIVATE KEY-----/g },
  { name: "Firebase-like API Key", regex: /AIza[\w-]{33}/g },
  // Removed GEMINI API Key pattern to reduce false positives
];

const matches = [];

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const fPath = path.join(dir, f);
    const stat = fs.statSync(fPath);
    if (stat.isDirectory()) {
      if (ignored.includes(f)) continue;
      walk(fPath);
      continue;
    }
    const ext = path.extname(fPath);
    if (!fileExtensions.includes(ext) && fPath.indexOf(".env") === -1) continue;
    try {
      const content = fs.readFileSync(fPath, "utf8");
      patterns.forEach((p) => {
        const re = new RegExp(p.regex, p.flags || "g");
        const m = content.match(re);
        if (m && m.length) {
          matches.push({ file: fPath, type: p.name, match: m.slice(0, 5) });
        }
      });
    } catch (e) {
      // ignore
    }
  }
}

walk(process.cwd());

if (matches.length) {
  console.error("Potential secret matches found:");
  matches.forEach((m) => {
    console.error(`${m.file} -> ${m.type} -> ${JSON.stringify(m.match)}`);
  });
  process.exit(2);
} else {
  console.log("No obvious PII or secret patterns detected.");
}
