# Database Recovery Runbook

## Purpose

Coordinate PostgreSQL recovery without inventing unverified commands.

## Preconditions

- Confirm the affected environment and service.
- Confirm access, authorization, and the last known healthy state.
- Follow the architecture and recovery policies linked below.

## Symptoms or Trigger

Use this runbook only for the operational condition named in its title.

## Procedure

The preserved master defines backup and recovery policy but does not provide environment-specific restore commands. Use the approved backup, ownership, and escalation process in the linked handbooks; do not improvise production recovery commands.

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
- [Infrastructure](../platform/INFRASTRUCTURE.md)
