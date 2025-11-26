#!/usr/bin/env bash
set -euo pipefail
PORT=${PORT:-4173}
BASE_URL="http://localhost:${PORT}"

echo "[a11y] Ensuring preview server is running on ${BASE_URL}"
$(dirname "$0")/ensure-preview-up.sh

export PLAYWRIGHT_BASE_URL="${BASE_URL}"
export PLAYWRIGHT_REUSE_EXISTING_SERVER="true"
export PLAYWRIGHT_AI_STUB="true"

echo "[a11y] Running a11y spec"
npx cross-env PLAYWRIGHT_AI_STUB=true node ./scripts/run-playwright.js test tests/e2e/a11y.spec.ts --reporter=list

if [ -f playwright-axe-results/axe-results.json ]; then
  echo "[a11y] Parsing axe results"
  node ./scripts/parse-axe-violations.cjs
else
  echo "[a11y] No axe results found at playwright-axe-results/axe-results.json"
fi
