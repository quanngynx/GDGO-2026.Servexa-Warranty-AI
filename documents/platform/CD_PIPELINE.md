# CD Pipeline

> Canonical handbook. The preserved source material remains under `documents/`.

## Purpose

Define promotion, delivery, release, and deployment automation.

## Scope

Cloud Build, Artifact Registry, environment promotion, releases, and future delivery evolution.

## Dependencies

Operational deployment and rollback steps are maintained in runbooks.

## Background

Background is provided by the linked master documentation.

## Architecture

The canonical architecture is defined in the related handbooks below.

## Design Principles

Apply the approved boundaries, ownership rules, and status classifications preserved in this handbook.

## Implementation

### Part V — CD Pipeline

---

### 41. Deployment Philosophy

Continuous Delivery emphasizes safe, repeatable, and observable deployments.

Key principles:

* Immutable deployments
* Progressive promotion
* Rollback readiness
* Environment consistency
* Automated verification

---

### 42. Deployment Flow

```text
Merge to Main

↓

GitHub Actions

↓

Cloud Build

↓

Docker Images

↓

Artifact Registry

↓

Cloud Run (Staging)

↓

Validation

↓

Manual Approval

↓

Cloud Run (Production)
```

---

### 43. Cloud Build

Cloud Build is responsible for:

* Container builds
* Image tagging
* Artifact publishing
* Deployment execution

Cloud Build acts as the deployment engine following successful CI validation.

---

### 44. Artifact Registry

Artifact Registry stores deployment-ready images.

Responsibilities:

* Image versioning
* Image promotion
* Security scanning
* Retention policies

Only validated images should be promoted to production.

---

### 49. Environment Promotion

Deployment follows a promotion model.

```text
Local

↓

Development

↓

Staging

↓

Production
```

Each environment validates the release before promotion.

---

### 50. Release Strategy

Releases should be:

* Small
* Frequent
* Reversible
* Observable

Large batch releases should be avoided.

---

### 52. Future CD Evolution

The deployment pipeline is intentionally designed for future expansion.

Potential enhancements include:

* Blue-Green Deployment
* Canary Releases
* Progressive Rollouts
* Automated Rollback
* Multi-region Deployment
* GitOps
* Infrastructure as Code (Terraform)
* Kubernetes-based Delivery

These enhancements are planned for future evolution and are not part of the current implementation.

### 25. CI/CD Pipeline

#### Overview

CI/CD giúp đảm bảo mọi thay đổi đều được kiểm tra và triển khai một cách tự động, nhất quán và có thể truy vết.

Pipeline cần đủ nhanh cho quá trình phát triển hằng ngày nhưng vẫn đảm bảo chất lượng trước khi phát hành.

---

#### Pipeline Overview

```text
[Data Flow Diagram]
Git Push

↓

Lint

↓

Unit Test

↓

Build

↓

Integration Test

↓

Docker Build

↓

Security Scan

↓

Deploy
```

---

#### Continuous Integration

Mỗi Pull Request phải vượt qua:

- Lint
- Formatting
- Type Check
- Unit Test
- Build Verification

---

#### Continuous Delivery

Sau khi Merge:

- Build Docker
- Push Registry
- Deploy Staging

Production cần Approval.

---

#### Release Strategy

Khuyến nghị:

- GitHub Flow
- Semantic Versioning
- Release Notes tự động

---

#### Rollback

Rollback chỉ cần:

```text
[State Diagram]
Current Version

↓

Previous Stable Image

↓

Deploy
```

Không rebuild lại.

---

#### Deliverables

- GitHub Actions
- Docker Registry
- Deployment Workflow
- Rollback Strategy

---

## Best Practices

Keep current decisions separate from Planned Evolution and Enterprise Vision material.

## Future Evolution

Future changes require the review and ADR controls described in the related documents.

## References

- [Legacy source](../../documents/4.platform/DEVOPS_MASTER_PLAN.md)
- [Legacy source](../../documents/TECHNICAL_MASTER_PLAN.md)

## Related ADRs

- [ADR-011: Cloud Run deployment strategy](../adr/ADR-011-cloud-run-deployment-strategy.md)

## Related Documents

- [DevOps Master Plan](./DEVOPS_MASTER_PLAN.md)
- [Technical Master Plan](../architecture/TECHNICAL_MASTER_PLAN.md)
- [Roadmap Master](../roadmap/ROADMAP_MASTER.md)
- [Deployment Runbook](../runbooks/deployment.md)
