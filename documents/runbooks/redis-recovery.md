# Redis Recovery Runbook

## Purpose

Coordinate Redis and Redis Streams recovery without treating process memory as authoritative state.

## Preconditions

- Confirm the affected environment and service.
- Confirm access, authorization, and the last known healthy state.
- Follow the architecture and recovery policies linked below.

## Symptoms or Trigger

Use this runbook only for the operational condition named in its title.

## Procedure

The preserved master defines Redis recovery behavior but does not provide environment-specific commands. Pause new asynchronous delivery, restore infrastructure through the approved platform process, then validate streams, shared state, and SSE projections.

## Validation

- Verify service health and the affected business workflow.
- Verify PostgreSQL, Redis, AI runtime, and streaming behavior when relevant.
- Record the outcome and unresolved risks.

## Rollback or Escalation

Stop and escalate when the preserved source material does not define an executable or verified recovery step.

## References

- [Legacy DevOps Master Plan](../../documents/4.platform/DEVOPS_MASTER_PLAN.md)

## Related Documents

- [Disaster Recovery](../platform/DISASTER_RECOVERY.md)
- [Event Architecture](../architecture/EVENT_ARCHITECTURE.md)
- [Shared State](../architecture/SHARED_STATE.md)
