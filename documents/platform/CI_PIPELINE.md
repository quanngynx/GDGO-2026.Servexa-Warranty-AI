# CI Pipeline

> Canonical handbook. The preserved source material remains under `documents/`.

## Purpose

Define pull-request validation and continuous-integration quality gates.

## Scope

Branch validation, tests, builds, contracts, matrices, GitHub Actions, and artifacts.

## Dependencies

CI validates the contracts and quality gates defined by architecture.

## Background

Background is provided by the linked master documentation.

## Architecture

The canonical architecture is defined in the related handbooks below.

## Design Principles

Apply the approved boundaries, ownership rules, and status classifications preserved in this handbook.

## Implementation

### Part IV — CI Pipeline

---

### 31. CI Philosophy

Continuous Integration ensures every code change is validated before merging.

Objectives:

* Detect issues early
* Prevent broken builds
* Maintain code quality
* Protect shared branches
* Validate cross-service compatibility

---

### 32. Branch Strategy

The project follows a lightweight trunk-based workflow.

```text
main
├── feature/*
├── fix/*
├── hotfix/*
└── chore/*
```

Workflow:

Feature Branch

↓

Pull Request

↓

CI Validation

↓

Review

↓

Merge into main

---

### 33. Pull Request Validation

Every Pull Request must trigger automated validation.

Mandatory checks:

* Lint
* Type Checking
* Unit Tests
* Build Verification
* Environment Validation
* Contract Validation

Merge is blocked until all required checks pass.

---

### 34. CI Pipeline Architecture

```text
Developer

↓

Push Branch

↓

GitHub

↓

GitHub Actions

↓

Validation Jobs

↓

Build

↓

Artifacts

↓

PR Status
```

---

### 35. Pipeline Stages

#### Stage 1 — Code Quality

Execute:

* ESLint
* Ruff
* Formatting checks

---

#### Stage 2 — Static Analysis

Execute:

* TypeScript Type Check
* Python Type Check
* Dependency Validation

---

#### Stage 3 — Testing

Execute:

* Unit Tests
* Integration Tests
* Contract Tests

---

#### Stage 4 — Build Validation

Verify:

* React Build
* Express Build
* FastAPI Build
* Docker Image Build

---

#### Stage 5 — Artifact Validation

Validate:

* Event Contracts
* API Schemas
* Generated Assets
* Environment Configuration

---

### 36. Contract Validation

Shared contracts are critical.

Changes affecting:

* Event Contracts
* Shared Types
* API Contracts

must trigger validation across:

* Web
* Express
* FastAPI

No incompatible changes should reach the main branch.

---

### 37. Quality Gates

The CI pipeline enforces mandatory quality gates.

Required:

* Lint Success
* Type Check Success
* Unit Test Success
* Integration Test Success
* Build Success
* Docker Build Success
* Contract Validation Success

Optional future gates:

* Security Scan
* Dependency Scan
* Performance Benchmarks

---

### 38. Build Matrix

Different changes trigger different validations.

| Changed Area     | Validation               |
| ---------------- | ------------------------ |
| apps/web         | Web Build & Tests        |
| apps/server      | Backend Build & Tests    |
| apps/ai-services | AI Build & Tests         |
| Shared Contracts | Cross-service Validation |
| Infrastructure   | Deployment Validation    |

This reduces unnecessary build time.

---

### 39. GitHub Actions

GitHub Actions is the primary CI platform.

Responsibilities:

* Workflow orchestration
* Parallel execution
* Artifact generation
* Status reporting

Reusable workflows should be preferred to reduce duplication.

---

### 40. CI Artifacts

Generated artifacts include:

* Build outputs
* Docker images
* Test reports
* Coverage reports
* Build logs

Artifacts should be retained for troubleshooting and auditing.

---

## Best Practices

Keep current decisions separate from Planned Evolution and Enterprise Vision material.

## Future Evolution

Future changes require the review and ADR controls described in the related documents.

## References

- [Legacy source](../../documents/4.platform/DEVOPS_MASTER_PLAN.md)

## Related ADRs

- [ADR-009: Monorepo architecture](../adr/ADR-009-monorepo-architecture.md)

## Related Documents

- [DevOps Master Plan](./DEVOPS_MASTER_PLAN.md)
- [Technical Master Plan](../architecture/TECHNICAL_MASTER_PLAN.md)
- [Roadmap Master](../roadmap/ROADMAP_MASTER.md)
- [Deployment Runbook](../runbooks/deployment.md)
