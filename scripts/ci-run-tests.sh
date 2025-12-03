#!/usr/bin/env bash
set -euo pipefail

export PGHOST=${PGHOST:-localhost}
export PGPORT=${PGPORT:-5432}
export PGUSER=${PGUSER:-postgres}
export PGPASSWORD=${PGPASSWORD:-postgres}
export PGDATABASE=${PGDATABASE:-phenix_test}

npm ci

node scripts/test-migration-tetrahedron.cjs
node scripts/test-security-harden.cjs

echo "All CI tests completed successfully."