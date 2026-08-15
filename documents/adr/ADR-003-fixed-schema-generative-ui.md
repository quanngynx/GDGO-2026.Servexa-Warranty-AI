# ADR-003: Fixed-schema Generative UI

Status: Proposed

Date: 2026-07-20

## Context

AI-assisted interfaces require controlled rendering without arbitrary generated React code.

## Decision

FastAPI may propose versioned UI schemas; Express validates and transports them; React maps approved schemas to registered components.

## Alternatives Considered

Alternatives and their current-versus-future classification are preserved in the [Architecture Decision Matrix](../architecture/APPENDIX.md#architecture-decision-matrix).

## Consequences

- The selected technology remains an approved architecture direction, not a claim of complete implementation.
- A separately approved ADR is required to replace this decision.

## References

- [Legacy Technical Master Plan](../../documents/TECHNICAL_MASTER_PLAN.md)
- [Legacy DevOps Master Plan](../../documents/4.platform/DEVOPS_MASTER_PLAN.md)

## Related Documents

- [Generative UI](../architecture/GENERATIVE_UI.md)
