#!/usr/bin/env bash
set -euo pipefail
ART_DIR="playwright-report/data"
if [ ! -d "$ART_DIR" ]; then
  echo "No artifacts directory found: $ART_DIR"
  exit 1
fi
ls -1t "$ART_DIR" | head -n 10
