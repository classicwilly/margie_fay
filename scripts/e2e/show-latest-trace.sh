#!/usr/bin/env bash
set -euo pipefail
TRACE_DIR="playwright-report/trace"
if [ ! -d "$TRACE_DIR" ]; then
  echo "No trace directory found: $TRACE_DIR"
  exit 1
fi
ls -1t "$TRACE_DIR" | head -n 10
