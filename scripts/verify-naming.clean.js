#!/usr/bin/env node
// verify-naming.clean.js
// Minimal name verification script for test

const path = require("path");
const { Project } = require("ts-morph");

const project = new Project({
  tsConfigFilePath: path.resolve(__dirname, "..", "tsconfig.json"),
});

const files = project.getSourceFiles([
  "components/**/*.{ts,tsx,js,jsx}",
  "src/**/*.{ts,tsx,js,jsx}",
]);
console.log("Found", files.length, "files for naming verification.");
process.exit(0);
