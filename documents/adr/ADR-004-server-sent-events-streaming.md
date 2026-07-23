# ADR-004: Server-Sent Events for Browser Streaming

Status: Proposed

Date: 2026-07-20

## Context

The browser primarily consumes one-way AI and workflow updates.

## Decision

Use authenticated SSE through Express as the browser streaming protocol.

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
