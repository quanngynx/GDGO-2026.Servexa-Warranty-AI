# Migrations and Operations

## DDL and Locks

- Many `ALTER TABLE` variants take strong locks and can block reads/writes until
  the rewrite completes. Research the specific operation on your PostgreSQL
  version before shipping.
- Prefer `CREATE INDEX CONCURRENTLY` / `DROP INDEX CONCURRENTLY` in production
  when non-blocking index changes are required (cannot run inside a transaction
  block — follow your migration runner’s guidance).

## Backfills

- Backfill new `NOT NULL` columns in stages: add nullable column + index if
  needed, fill in batches, then set `NOT NULL` with a `CHECK` or validate
  constraint pattern appropriate to PG version.
- Use batch sizes and `COMMIT` between batches to avoid long transactions and
  table bloat from a single massive update.

## Rollouts

- Ship code compatible with both old and new schema when doing multi-step
  releases (expand → migrate data → contract).
- Feature flags should gate behavior, not leave the database in an inconsistent
  hybrid state longer than necessary.

## Extensions and Configuration

- Treat extensions (`uuid-ossp`, `pgcrypto`, `citext`, etc.) as part of the
  migration story: versioned install, documented privileges, and restore
  implications.

## Hygiene

- `VACUUM` / autovacuum tuning matters for churn-heavy tables; monitor bloat and
  long-running autovacuum.
- Avoid running DDL against production from a laptop without a reviewed
  migration and rollback story.
