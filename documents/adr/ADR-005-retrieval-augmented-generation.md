# ADR-005: Retrieval-Augmented Generation

Status: Proposed

Date: 2026-07-20

## Context

AI recommendations require grounded evidence from the canonical knowledge corpus.

## Decision

Use PostgreSQL with pgvector for the approved retrieval architecture and preserve alternative vector stores as future options only.

## Alternatives Considered

Alternatives and their current-versus-future classification are preserved in the [Architecture Decision Matrix](../architecture/APPENDIX.md#architecture-decision-matrix).

## Consequences

- The selected technology remains an approved architecture direction, not a claim of complete implementation.
- A separately approved ADR is required to replace this decision.

## References

- [Legacy Technical Master Plan](../../documents/TECHNICAL_MASTER_PLAN.md)
- [Legacy DevOps Master Plan](../../documents/4.platform/DEVOPS_MASTER_PLAN.md)

## Related Documents

- [AI Runtime](../architecture/AI_RUNTIME.md)
