# ADR-002: PostgreSQL Business Authority and Redis Shared State

Status: Proposed

Date: 2026-07-20

## Context

Business records and workflow coordination state have different durability and consistency requirements.

## Decision

PostgreSQL remains the business source of truth. Redis stores externalized coordination state, while durable workflow checkpoints use PostgreSQL.

## Alternatives Considered

Alternatives and their current-versus-future classification are preserved in the [Architecture Decision Matrix](../architecture/APPENDIX.md#architecture-decision-matrix).

## Consequences

- The selected technology remains an approved architecture direction, not a claim of complete implementation.
- A separately approved ADR is required to replace this decision.

## References

- [Legacy Technical Master Plan](../../documents/TECHNICAL_MASTER_PLAN.md)
- [Legacy DevOps Master Plan](../../documents/4.platform/DEVOPS_MASTER_PLAN.md)

## Related Documents

- [Shared State](../architecture/SHARED_STATE.md)
