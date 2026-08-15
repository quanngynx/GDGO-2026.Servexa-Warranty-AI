# ADR-009: Monorepo Architecture

Status: Proposed

Date: 2026-07-20

## Context

The web, business backend, AI runtime, contracts, and infrastructure evolve together.

## Decision

Maintain the applications and shared contracts in the existing pnpm/Turbo monorepo.

## Alternatives Considered

Alternatives and their current-versus-future classification are preserved in the [Architecture Decision Matrix](../architecture/APPENDIX.md#architecture-decision-matrix).

## Consequences

- The selected technology remains an approved architecture direction, not a claim of complete implementation.
- A separately approved ADR is required to replace this decision.

## References

- [Legacy Technical Master Plan](../../documents/TECHNICAL_MASTER_PLAN.md)
- [Legacy DevOps Master Plan](../../documents/4.platform/DEVOPS_MASTER_PLAN.md)

## Related Documents

- [Development Environment](../platform/DEVELOPMENT_ENVIRONMENT.md)
