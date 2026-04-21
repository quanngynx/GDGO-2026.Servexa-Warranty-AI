# Indexing

Goal: support real query shapes without over-indexing (each index costs writes
and storage).

## Basics

- Index foreign-key columns used in joins and `WHERE` clauses on the child
  table.
- Composite indexes: column order matches filter equality first, then range
  sort, then `ORDER BY` columns as needed for index-only plans.
- Avoid redundant indexes (e.g. `(a)` plus `(a, b)` may be redundant depending on
  queries — verify with workload).

## Partial Indexes

- Strong fit for boolean flags, soft delete, and status filters that appear in
  almost every query:

```sql
CREATE INDEX idx_orders_open ON orders (created_at)
WHERE status = 'open' AND deleted_at IS NULL;
```

- Pair with partial `UNIQUE` constraints for "one active row per key" patterns.

## Text Search

- `pg_trgm` on `text` columns for `LIKE '%foo%'`-style search when required;
  otherwise prefer full-text search (`tsvector`) for language-aware search.

## Large Append-Only Tables

- Consider `BRIN` for naturally ordered columns (e.g. time-series ingest) when
  table scans are acceptable in exchange for tiny index size.

## Dangerous Defaults

- Low-cardinality indexes alone (e.g. boolean) rarely help; combine with
  selective predicates or use partial indexes.

## Verification

- After adding/changing indexes, validate with realistic `EXPLAIN (ANALYZE,
  BUFFERS)` from [queries-and-performance.md](queries-and-performance.md).
