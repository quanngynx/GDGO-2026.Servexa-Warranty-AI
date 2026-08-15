# Deployment Runbook

## Purpose

Guide staging and production deployment validation using the procedures preserved by the platform plan.

## Preconditions

- Confirm the affected environment and service.
- Confirm access, authorization, and the last known healthy state.
- Follow the architecture and recovery policies linked below.

## Symptoms or Trigger

Use this runbook only for the operational condition named in its title.

## Procedure

### 45. Staging Deployment

Every successful merge to the main branch deploys automatically to the staging environment.

Deployment tasks:

* Deploy services
* Apply configuration
* Run database migrations
* Execute smoke tests
* Validate service health

---

### 46. Smoke Testing

Staging deployment includes automated smoke tests.

Typical validation flow:

* User Authentication
* Business API
* AI Request
* Tool Execution
* Streaming Response
* Shared State Synchronization

Deployment proceeds only if smoke tests succeed.

---

### 47. Production Deployment

Production deployment requires explicit approval.

Workflow:

Staging Success

↓

Manual Approval

↓

Production Deployment

↓

Health Check

↓

Monitoring

This reduces deployment risk while maintaining delivery speed.

---

### 51. Deployment Verification

Every deployment should verify:

Application

* Startup
* Health Endpoint
* Readiness

Infrastructure

* Database Connection
* Redis Connection
* AI Runtime Availability

Business Flow

* Login
* Warranty Lookup
* AI Conversation
* Streaming
* Tool Execution

Deployment is considered successful only after both infrastructure and business workflow validation complete.

---

### Appendix E — Deployment Checklist

Before every production deployment, verify:

#### Application

* Build completed successfully
* Tests passed
* Container images published
* Configuration validated

#### Infrastructure

* Database available
* Redis available
* Secrets configured
* Networking verified

#### AI Platform

* FastAPI healthy
* LangGraph initialized
* Retrieval functioning
* Tool execution verified

#### Business Workflow

* User authentication
* Warranty lookup
* AI conversation
* Streaming response
* Shared State synchronization

Production deployment should proceed only after all critical checks succeed.

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
- [Deployment Architecture](../platform/DEPLOYMENT_ARCHITECTURE.md)
- [Rollback Runbook](./rollback.md)
