#!/usr/bin/env node
/* Validate that module manifests contain required fields and unique ids */
import fs from "fs";
import path from "path";
import { sync as globSync } from "glob";
import { parse } from "@babel/parser";
import ModuleManifestSchema from "./schemas/moduleManifestSchema.mjs";

const repoRoot = path.resolve("..");
const modulesDir = path.resolve("src", "modules");
const entries = globSync("**/index.{ts,tsx}", {
  cwd: modulesDir,
  nodir: true,
}).filter((p) => path.dirname(p) !== ".");

function fail(msg) {
  console.error("Manifest validation failed:", msg);
  process.exitCode = 2;
}

function nodeToValue(node) {
  switch (node.type) {
    case "StringLiteral":
    case "NumericLiteral":
    case "BooleanLiteral":
    case "NullLiteral":
      return node.value;
    case "ArrayExpression":
      return node.elements.map((el) => (el ? nodeToValue(el) : null));
    case "ObjectExpression": {
      const obj = {};
      for (const prop of node.properties) {
        if (prop.type !== "ObjectProperty") return undefined;
        const key =
          prop.key.type === "Identifier"
            ? prop.key.name
            : prop.key.type === "StringLiteral"
              ? prop.key.value
              : null;
        if (!key) return undefined;
        const val = nodeToValue(prop.value);
        if (val === undefined) return undefined;
        obj[key] = val;
      }
      return obj;
    }
    default:
      return undefined; // unsupported expression (e.g. Identifier, CallExpression)
  }
}

function extractRelevantFields(objectNode) {
  if (objectNode.type !== "ObjectExpression") return undefined;
  const obj = {};
  for (const prop of objectNode.properties) {
    if (prop.type !== "ObjectProperty") continue;
    const key =
      prop.key.type === "Identifier"
        ? prop.key.name
        : prop.key.type === "StringLiteral"
          ? prop.key.value
          : null;
    if (!key) continue;
    switch (prop.value.type) {
      case "StringLiteral":
      case "NumericLiteral":
      case "BooleanLiteral":
        obj[key] = prop.value.value;
        break;
      case "ArrayExpression":
        obj[key] = prop.value.elements
          .map((el) => (el && el.type === "StringLiteral" ? el.value : null))
          .filter(Boolean);
        break;
      case "ObjectExpression": {
        const nested = nodeToValue(prop.value);
        if (nested !== undefined) obj[key] = nested;
        break;
      }
      default:
        // dynamic expression like component or reducer - ignore for schema check
        break;
    }
  }
  return obj;
}

const ids = new Set();
const manifestsById = new Map();

for (const rel of entries) {
  const filePath = path.join(modulesDir, rel);
  const text = fs.readFileSync(filePath, "utf8");
  let manifestObj;
  try {
    const ast = parse(text, {
      sourceType: "module",
      plugins: ["typescript", "jsx"],
    });
    let lastManifestDeclaration = null;
    for (const node of ast.program.body) {
      if (node.type === "VariableDeclaration") {
        for (const d of node.declarations) {
          if (
            d.id &&
            d.id.type === "Identifier" &&
            d.id.name === "manifest" &&
            d.init &&
            d.init.type === "ObjectExpression"
          ) {
            lastManifestDeclaration = d.init;
          }
        }
      }
      if (node.type === "ExportNamedDeclaration") {
        const decl = node.declaration;
        if (decl && decl.type === "VariableDeclaration") {
          for (const d of decl.declarations) {
            if (
              d.id &&
              d.id.type === "Identifier" &&
              d.id.name === "manifest" &&
              d.init &&
              d.init.type === "ObjectExpression"
            ) {
              manifestObj = extractRelevantFields(d.init);
            }
          }
        }
      }
      if (node.type === "ExportDefaultDeclaration") {
        const decl = node.declaration;
        if (decl && decl.type === "ObjectExpression") {
          manifestObj = extractRelevantFields(decl);
        } else if (
          decl &&
          decl.type === "Identifier" &&
          decl.name === "manifest" &&
          lastManifestDeclaration
        ) {
          manifestObj = extractRelevantFields(lastManifestDeclaration);
        }
      }
    }
  } catch (err) {
    fail(`${filePath} parse error: ${err.message}`);
  }
  if (!manifestObj)
    fail(
      `${filePath} no static manifest object found (expected export const manifest = {...} or export default {...})`,
    );

  try {
    ModuleManifestSchema.parse(manifestObj);
  } catch (err) {
    fail(`${filePath} manifest schema validation failed: ${err}`);
  }

  const id = manifestObj.id;
  if (!id) fail(`${filePath} missing id`);
  if (ids.has(id))
    fail(`Duplicate module id detected: ${id} (file ${filePath})`);
  ids.add(id);
  manifestsById.set(id, { filePath, manifest: manifestObj });
}

// Validate declared dependencies exist
for (const [id, data] of manifestsById.entries()) {
  const deps = data.manifest.dependencies || [];
  for (const dep of deps) {
    if (!manifestsById.has(dep)) {
      fail(
        `${data.filePath} declares dependency '${dep}', but no module with that id was found`,
      );
    }
  }
}

console.log(
  `Validated ${entries.length} module manifests; ${ids.size} unique ids`,
);
