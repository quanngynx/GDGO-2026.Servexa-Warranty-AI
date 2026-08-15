# ADR-012: Production Readiness Uses Sequential Hard Gates

Status: Accepted

Date: 2026-08-12

## Context

The existing Phase 0-8 roadmap describes progressive AI capabilities and their
repository implementation status. It does not prove enterprise production
readiness. Later capabilities already exist while predecessor contracts,
enterprise identity, durable external execution, audit, HA, recovery, and
operational proof remain incomplete.

The target production slice also depends on facts that are not present in the
repository: a named enterprise, external warranty system, deployment target in
Vietnam, enterprise IdP, managed AI provider terms, workload baseline, and
accountable sign-offs.

## Decision

Servexa adopts the sequential P0-P9 Production Completion Roadmap.

- Capability Phase 0-8 status never implies production certification.
- Production progression is sequential; every predecessor must be `CLOSED`.
- P0 is a hard gate and is currently `BLOCKED`.
- P1-P9 production implementation cannot begin until P0 selects and verifies
  the enterprise, external system/connector, Vietnam deployment target, IdP,
  AI provider, topology, capacity baseline, and required sign-offs.
- Gate state is machine-readable in
  [`p0-gate.json`](../production-readiness/p0-gate.json) and validated by the
  repository gate command.
- Experiments or existing capabilities beyond the current gate must be labelled
  non-production and cannot be used as evidence that a gate is closed.

## Alternatives considered

### Treat existing capability phases as production phases

Rejected because implementation presence does not prove predecessor contracts,
security, recovery, operations, or external-system behavior.

### Start application work while enterprise choices remain unknown

Rejected because it would embed hypothetical identity, connector, residency,
and infrastructure assumptions that P0 explicitly exists to resolve.

### Allow later phases to proceed in parallel before predecessor sign-off

Rejected for production claims. Research spikes remain possible only when
isolated, synthetic, reversible, and labelled non-production.

## Consequences

### Positive

- Production claims become evidence-based and auditable.
- Enterprise-dependent choices are explicit instead of hidden in code defaults.
- Teams cannot confuse a demo, partial feature, or narrow test with release readiness.
- The integration, identity, and production-gate seams stay small and reviewable.

### Negative

- P0 can block engineering progress until external stakeholders provide evidence.
- Existing Cloud Run, Docker Compose, local auth, HITL, and ERP helper code cannot
  be promoted as production-ready without revalidation.
- Every phase requires maintained evidence and named approvers.

## Related documents

- [Production Readiness Control Center](../production-readiness/README.md)
- [Production Completion Roadmap](../production-readiness/PRODUCTION_COMPLETION_ROADMAP.md)
- [Roadmap Master](../roadmap/ROADMAP_MASTER.md)
- [Technical Master Plan](../architecture/TECHNICAL_MASTER_PLAN.md)

