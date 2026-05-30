# Schema Design

PostgreSQL-oriented table and column design. Prefer boring, explicit schemas.

## Data Types

- Prefer `text` over `varchar(n)` unless `n` is a real domain rule enforced by
  the database.
- Use `timestamptz` for all instants in time; avoid `timestamp` without time zone.
- Use `boolean` with explicit `NOT NULL` and a deliberate default when the
  column is required for business logic.
- Prefer `numeric` for money and exact decimals; avoid floating point for money.
- Use `uuid` for primary keys when IDs are public, client-generated, or merged
  across systems; otherwise `bigint` identity is often simpler and smaller.
- Prefer `bigint` / `identity` over `serial` for new code (`serial` is legacy).

## Constraints and Integrity

- Declare `PRIMARY KEY`, `UNIQUE`, `FOREIGN KEY`, and `CHECK` in the database,
  not only in application code.
- Name constraints consistently (e.g. `table_column_fkey`) when your migration
  tooling allows it — aids debugging in logs.
- Use `ON DELETE` / `ON UPDATE` actions intentionally; default `NO ACTION` is
  fine when you want failures to surface during development.

## Nullability and Defaults

- Prefer `NOT NULL` with a default over nullable "tri-state" unless unknown is
  meaningful.
- Avoid `DEFAULT NULL`; omit default when the column is nullable without a
  default preference.

## Enums and Categories

- Small fixed sets: `enum` type or lookup table. `enum` is fast to change in
  controlled environments; lookup tables are easier for evolving taxonomies and
  referential integrity to metadata.
- For evolving labels without DDL churn, `text` + `CHECK` or a reference table
  is often safer than many enum alterations.

## JSON (`jsonb`)

- Use `jsonb` for truly semi-structured payloads, not as a substitute for
  normalized columns you query and constrain heavily.
- Add `GIN` indexes only for proven query patterns; `jsonb` without indexes can
  still be expensive at scale.

## Common Columns

- `created_at` / `updated_at`: `timestamptz`, set `updated_at` via trigger or
  application layer — pick one approach per codebase and stay consistent.
- Soft delete: `deleted_at timestamptz NULL` with partial unique indexes where
  uniqueness applies only to active rows (see [indexing.md](indexing.md)).

## Naming

- Use `snake_case` for identifiers unless the project already standardizes
  otherwise — match the existing database naming for this repo.
