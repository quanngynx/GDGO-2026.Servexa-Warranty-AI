# Rollback Runbook

## Purpose

Restore the last known healthy deployment when verification fails or a regression is detected.

## Preconditions

- Confirm the affected environment and service.
- Confirm access, authorization, and the last known healthy state.
- Follow the architecture and recovery policies linked below.

## Symptoms or Trigger

Use this runbook only for the operational condition named in its title.

## Procedure

### 48. Rollback Strategy

Rollback must be simple and predictable.

Possible rollback triggers:

* Health check failure
* High error rate
* Critical regression
* Infrastructure failure

Rollback methods:

* Previous Cloud Run Revision
* Previous Container Image
* Database rollback (when applicable)

---

### 111. Rollback Strategy

Every production deployment must support immediate rollback.

Rollback scenarios include:

* Deployment Failure
* Performance Regression
* Functional Regression
* Security Incident

Rollback should restore the last known healthy deployment with minimal downtime.

---

## Validation

- Verify service health and the affected business workflow.
- Verify PostgreSQL, Redis, AI runtime, and streaming behavior when relevant.
- Record the outcome and unresolved risks.

## Rollback or Escalation

Stop and escalate when the preserved source material does not define an executable or verified recovery step.

## References

- [Legacy DevOps Master Plan](../../documents/4.platform/DEVOPS_MASTER_PLAN.md)

## Related Documents

- [CD Pipeline](../platform/CD_PIPELINE.md)
- [Disaster Recovery](../platform/DISASTER_RECOVERY.md)
