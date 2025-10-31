#!/usr/bin/env zsh
# Simple script to apply all SQL migration files in `supabase/migrations` to a Postgres DB.
# Usage:
#   export DATABASE_URL="postgresql://postgres:password@db.host.supabase.co:5432/postgres"
#   ./scripts/apply_supabase_migrations.sh

set -euo pipefail

MIGRATIONS_DIR="$(dirname -- "${0}")/../supabase/migrations"

if [[ ! -d "$MIGRATIONS_DIR" ]]; then
  echo "Migrations directory not found: $MIGRATIONS_DIR"
  exit 1
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "Please set DATABASE_URL environment variable to your Supabase Postgres connection string."
  echo "Example: export DATABASE_URL=\"postgresql://postgres:password@db.host.supabase.co:5432/postgres\""
  exit 2
fi

if ! command -v psql >/dev/null 2>&1; then
  echo "psql not found. Please install the Postgres client (psql) and ensure it's on your PATH."
  exit 3
fi

echo "Applying migrations from: $MIGRATIONS_DIR"

for f in $(ls "$MIGRATIONS_DIR"/*.sql | sort); do
  echo "---> Applying: $f"
  psql "$DATABASE_URL" -f "$f"
  echo "    Done: $f"
done

echo "All migrations applied."
