#!/usr/bin/env bash
set -euo pipefail
PORT=${PORT:-4173}
BASE_URL="http://localhost:${PORT}"

$(dirname "$0")/ensure-preview-up.sh

node ./scripts/dump-headings.js "$BASE_URL"
