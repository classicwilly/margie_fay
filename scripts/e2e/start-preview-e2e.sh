#!/usr/bin/env bash
set -euo pipefail
PORT=${PORT:-4173}
BASE_URL="http://localhost:${PORT}"

TESTS=${@:-"tests/e2e/a11y.spec.ts tests/e2e/grandma.spec.ts tests/e2e/airlock.spec.ts"}

echo "[e2e] Starting or reusing preview server on ${BASE_URL}"
"$(dirname "$0")/ensure-preview-up.sh"

echo "[e2e] Running Playwright tests: ${TESTS}"
export PLAYWRIGHT_BASE_URL="${BASE_URL}"
export PLAYWRIGHT_REUSE_EXISTING_SERVER="true"
export PLAYWRIGHT_AI_STUB="true"

npm run e2e:stub -- ${TESTS}

EXIT_CODE=$?
if [ ${EXIT_CODE} -ne 0 ]; then
  echo "[e2e] Playwright tests exited with code ${EXIT_CODE}" >&2
fi
exit ${EXIT_CODE}
