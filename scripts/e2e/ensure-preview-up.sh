#!/usr/bin/env bash
set -euo pipefail
PORT=${PORT:-4173}
BASE_URL="http://localhost:${PORT}"

echo "[e2e] Using preview base URL: ${BASE_URL}"

is_port_open() {
  if command -v curl >/dev/null 2>&1; then
    curl -sS --fail --max-time 2 "$BASE_URL" >/dev/null 2>&1 && return 0 || return 1
  elif command -v nc >/dev/null 2>&1; then
    nc -z localhost "$PORT" >/dev/null 2>&1 && return 0 || return 1
  else
    return 1
  fi
}

if is_port_open; then
  echo "[e2e] Preview server already running on ${BASE_URL}. Reusing it."
  exit 0
fi

echo "[e2e] Preview server not detected. Building and starting preview server..."

npm run build

LOGFILE="preview-server-${PORT}.log"
nohup npm run preview --silent >"${LOGFILE}" 2>&1 &
PREVIEW_PID=$!
echo "[e2e] Started preview server (PID ${PREVIEW_PID}), logging to ${LOGFILE}"

for i in $(seq 1 60); do
  if is_port_open; then
    echo "[e2e] Preview server ready after ${i}s"
    exit 0
  fi
  sleep 1
done

echo "[e2e] ERROR: preview server did not start on port ${PORT} in time. Check ${LOGFILE} for details." >&2
exit 1
