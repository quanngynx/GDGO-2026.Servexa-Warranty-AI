# Queries and Performance

## Before Optimizing

- Confirm the bottleneck is the database (not network, serialization, or N+1
  at the ORM layer).
- Capture the exact SQL shape and parameters representative of production.

## `EXPLAIN`

- Use `EXPLAIN (ANALYZE, BUFFERS)` in a staging copy with similar data volume.
- Watch for sequential scans that should be index scans, nested loops with huge
  row estimates, and excessive buffer reads.

## Pagination

- Prefer keyset (`WHERE id > $cursor ORDER BY id LIMIT n`) over large `OFFSET`
  for deep pages.
- Ensure the keyset columns are indexed in sort order.

## Joins and Aggregates

- Push filters early: constrain the driving table before joining wide tables.
- For heavy aggregates, consider materialized views or pre-aggregated tables
  refreshed on a schedule when freshness allows.

## `COUNT(*)`

- Exact counts on huge tables are expensive; use estimates (`pg_class`,
  `hyperloglog`, or deferred counters) when approximate is acceptable.

## Locking in Transactions

- Keep transactions short; avoid interactive work inside a transaction holding
  row locks.
- Know `SELECT ... FOR UPDATE` scope — it is easy to deadlock if lock order is
  inconsistent across code paths.

## Collation

- Be explicit when case/accent sensitivity matters; collation surprises often
  show up in unique constraints and `ORDER BY`.
