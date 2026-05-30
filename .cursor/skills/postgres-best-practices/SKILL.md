---
name: postgres-best-practices
description: >-
  Applies PostgreSQL schema, indexing, query, and migration guidance for this
  repo. Use when writing SQL or Prisma raw queries, designing or changing tables,
  adding indexes, tuning slow queries, planning zero-downtime migrations, or
  reviewing database-related PRs.
---

# Postgres Best Practices

Use this skill whenever database work touches PostgreSQL: new tables, columns,
constraints, indexes, migrations, or performance-sensitive queries.

## How to Use This Skill

1. **Identify the task** (schema change, index, query, or migration).
2. **Read the matching reference** from the table below — do not guess details
   that belong in the reference file.
3. **Prefer explicit constraints and types** over implicit defaults.
4. **Validate risky changes**: check locking behavior for DDL, and use `EXPLAIN
   (ANALYZE, BUFFERS)` for query tuning when the user cares about performance.

## Quick Checklist (Any Change)

- [ ] Correct types for the domain (`timestamptz`, `text` vs `varchar`, etc.).
- [ ] Primary key and uniqueness enforced with constraints, not only app logic.
- [ ] Foreign keys indexed on the referencing side when used in joins/filters.
- [ ] Default values and `NOT NULL` aligned with migration/backfill plan.
- [ ] Migration avoids unnecessary full-table rewrites and long exclusive locks.

## References

| Area | File | When to Read |
| ---- | ---- | ------------ |
| Schema design | [references/schema-design.md](references/schema-design.md) | New tables/columns, enums, JSON, soft delete |
| Indexing | [references/indexing.md](references/indexing.md) | New or changed indexes, slow filters/joins |
| Queries and performance | [references/queries-and-performance.md](references/queries-and-performance.md) | Slow endpoints, N+1, pagination, aggregates |
| Migrations and operations | [references/migrations-and-operations.md](references/migrations-and-operations.md) | DDL rollout, backfills, extensions, backups |

## Integration Notes (Prisma / App Code)

- Schema in Prisma should still follow the same PostgreSQL rules: types map to
  real PG types, and indexes/constraints declared explicitly when the default is
  insufficient.
- For Prisma CLI workflows, use the project `prisma-cli` skill; this skill focuses
  on PostgreSQL behavior and design, not ORM commands.

## Escalation

If requirements conflict (e.g. immediate consistency vs. minimal locking),
state the tradeoff briefly and pick the safer default for production unless the
user chooses otherwise.
