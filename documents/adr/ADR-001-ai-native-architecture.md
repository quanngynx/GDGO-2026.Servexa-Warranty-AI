# ADR-001: Adopt AI-native Architecture

Status: Proposed

Date: 2026-07-20

## Context

The platform separates the React interface, Express business authority, and FastAPI AI orchestration runtime.

## Decision

Use React for the browser application, Express.js for business APIs and authorization, FastAPI with LangGraph for AI orchestration, and independently deployable Cloud Run services.

## Alternatives Considered

Alternatives and their current-versus-future classification are preserved in the [Architecture Decision Matrix](../architecture/APPENDIX.md#architecture-decision-matrix).

## Consequences

- The selected technology remains an approved architecture direction, not a claim of complete implementation.
- A separately approved ADR is required to replace this decision.

## References

- [Legacy Technical Master Plan](../../documents/TECHNICAL_MASTER_PLAN.md)
- [Legacy DevOps Master Plan](../../documents/4.platform/DEVOPS_MASTER_PLAN.md)

## Related Documents

- [System Overview](../architecture/SYSTEM_OVERVIEW.md)
