# ADR-008: Polyglot Persistence

Status: Proposed

Date: 2026-07-20

## Context

Transactional business data, vector retrieval, coordination state, and workflow events have distinct access patterns.

## Decision

Use PostgreSQL and pgvector for durable data and retrieval, with Redis and Redis Streams for coordination and asynchronous delivery.

## Alternatives Considered

Alternatives and their current-versus-future classification are preserved in the [Architecture Decision Matrix](../architecture/APPENDIX.md#architecture-decision-matrix).

## Consequences

- The selected technology remains an approved architecture direction, not a claim of complete implementation.
- A separately approved ADR is required to replace this decision.

## References

- [Legacy Technical Master Plan](../../documents/TECHNICAL_MASTER_PLAN.md)
- [Legacy DevOps Master Plan](../../documents/4.platform/DEVOPS_MASTER_PLAN.md)

## Related Documents

- [Infrastructure](../platform/INFRASTRUCTURE.md)
