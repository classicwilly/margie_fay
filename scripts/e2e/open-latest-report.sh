#!/usr/bin/env bash
set -euo pipefail
OUT_DIR="playwright-report"
REPORT_HTML="$OUT_DIR/index.html"
if [ ! -f "$REPORT_HTML" ]; then
  echo "No Playwright report HTML at $REPORT_HTML" >&2
  exit 1
fi
if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$REPORT_HTML" >/dev/null 2>&1 &
elif command -v open >/dev/null 2>&1; then
  open "$REPORT_HTML"
else
  echo "Open the file in your browser: file://$(pwd)/$REPORT_HTML"
fi
