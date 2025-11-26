const fs = require("fs");
const path = require("path");

const inputFile = process.argv[2];
const outputFile = process.argv[3];

if (!inputFile || !outputFile) {
  console.error(
    "Usage: node fix-eslint-tailwind.js <input.json> <output.json>",
  );
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(inputFile, "utf8"));

function unescapeJsonString(str) {
  try {
    return JSON.parse('"' + str + '"');
  } catch (e) {
    console.warn("Failed to unescape:", str);
    return str;
  }
}

function reescapeJsonString(str) {
  return JSON.stringify(str).slice(1, -1);
}

let replacements = 0;

for (let item of data) {
  const fieldsToCheck = ["text", "message", "html", "source"];
  for (let field of fieldsToCheck) {
    if (item[field] && typeof item[field] === "string") {
      let unescaped = unescapeJsonString(item[field]);
      const original = unescaped;
      unescaped = unescaped
        .replace(/\bflex-grow\b/g, "grow")
        .replace(/\bbreak-words\b/g, "break-word")
        .replace(/\bflex-shrink(-\d+)?\b/g, (m, s) => "shrink" + (s || ""))
        .replace(/\bflex-no[-_]wrap\b/g, "flex-nowrap");
      if (unescaped !== original) {
        replacements++;
      }
      item[field] = reescapeJsonString(unescaped);
    }
  }
}

fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
console.log(
  `Processed ${data.length} items, made ${replacements} replacements. Output written to ${outputFile}`,
);

// Validate
try {
  JSON.parse(fs.readFileSync(outputFile, "utf8"));
  console.log("JSON validation passed.");
} catch (e) {
  console.error("JSON validation failed:", e.message);
  process.exit(1);
}
