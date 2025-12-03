# CI: Migrations & Security

This repository includes a GitHub Actions workflow that runs migration and security tests on pull requests. The job is in `.github/workflows/ci-migrations.yml` and runs the following Node.js scripts:

- `scripts/test-migration-tetrahedron.cjs`
- `scripts/test-security-harden.cjs`
- `scripts/test-mesh-heartbeat.cjs`

What the workflow does:

1. Starts a Postgres 14 service (database name: `phenix_test`, user `postgres`, password `postgres`).
2. Waits for the DB to be ready, sets necessary env vars, installs Node dependencies, and runs both test scripts.
3. Runs the mesh heartbeat test to exercise the `record_mesh_heartbeat` RPC and heartbeat logging.

Running the CI script locally

If you want to replicate the CI run locally (on macOS or Linux), you can start a Postgres container and run the helper script:

```bash
# Start a local postgres container
docker run --name phenix_test_db -e POSTGRES_PASSWORD=postgres -e POSTGRES_USER=postgres -e POSTGRES_DB=phenix_test -p 5432:5432 -d postgres:14

# Wait for DB
sleep 2

# Export env vars and run the tests
export PGHOST=localhost
export PGPORT=5432
export PGUSER=postgres
export PGPASSWORD=postgres
export PGDATABASE=phenix_test

./scripts/ci-run-tests.sh

# Teardown
# docker rm -f phenix_test_db
```

Notes

- If your test scripts expect a different DB name or port, adjust the environment variables above or the workflow file accordingly.
- The CI workflow runs on `ubuntu-latest` and doesn't require secrets by default; for production-sensitive tests, wire up secrets via repository secrets.
