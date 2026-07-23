# ADR-010: Event-driven AI Runtime

Status: Proposed

Date: 2026-07-20

## Context

Long-running and asynchronous AI work requires replayable delivery outside request memory.

## Decision

Use Redis Streams as the workflow event backbone; keep Redis Pub/Sub for non-durable notification fan-out.

## Alternatives Considered

Alternatives and their current-versus-future classification are preserved in the [Architecture Decision Matrix](../architecture/APPENDIX.md#architecture-decision-matrix).

## Consequences

- The selected technology remains an approved architecture direction, not a claim of complete implementation.
- A separately approved ADR is required to replace this decision.

## References

- [Legacy Technical Master Plan](../../documents/TECHNICAL_MASTER_PLAN.md)
- [Legacy DevOps Master Plan](../../documents/4.platform/DEVOPS_MASTER_PLAN.md)

## Related Documents

- [Event Architecture](../architecture/EVENT_ARCHITECTURE.md)
