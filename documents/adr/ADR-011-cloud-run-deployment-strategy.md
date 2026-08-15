# ADR-011: Cloud Run Deployment Strategy

Status: Proposed

Date: 2026-07-20

## Context

The three runtime services require independent, immutable deployment and scaling.

## Decision

Package each runtime as a container and deploy it independently to Cloud Run through the approved delivery pipeline.

## Alternatives Considered

Alternatives and their current-versus-future classification are preserved in the [Architecture Decision Matrix](../architecture/APPENDIX.md#architecture-decision-matrix).

## Consequences

- The selected technology remains an approved architecture direction, not a claim of complete implementation.
- A separately approved ADR is required to replace this decision.

## References

- [Legacy Technical Master Plan](../../documents/TECHNICAL_MASTER_PLAN.md)
- [Legacy DevOps Master Plan](../../documents/4.platform/DEVOPS_MASTER_PLAN.md)

## Related Documents

- [Deployment Architecture](../platform/DEPLOYMENT_ARCHITECTURE.md)
