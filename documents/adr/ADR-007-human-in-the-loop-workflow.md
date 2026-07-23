# ADR-007: Human-in-the-loop Workflow

Status: Proposed

Date: 2026-07-20

## Context

High-impact AI recommendations require review before business execution.

## Decision

Use explicit LangGraph interrupt/resume and durable approval state for workflows requiring human authorization.

## Alternatives Considered

Alternatives and their current-versus-future classification are preserved in the [Architecture Decision Matrix](../architecture/APPENDIX.md#architecture-decision-matrix).

## Consequences

- The selected technology remains an approved architecture direction, not a claim of complete implementation.
- A separately approved ADR is required to replace this decision.

## References

- [Legacy Technical Master Plan](../../documents/TECHNICAL_MASTER_PLAN.md)
- [Legacy DevOps Master Plan](../../documents/4.platform/DEVOPS_MASTER_PLAN.md)

## Related Documents

- [Reasoning and Human Review](../architecture/REASONING.md)
