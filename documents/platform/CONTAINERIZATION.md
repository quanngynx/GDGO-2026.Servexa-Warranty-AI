# Containerization

> Canonical handbook. The preserved source material remains under `documents/`.

## Purpose

Define immutable container responsibilities and build controls.

## Scope

Container topology, Dockerfiles, image versioning, registry, optimization, runtime configuration, and security.

## Dependencies

Each deployable runtime retains the ownership boundaries defined by architecture.

## Background

Background is provided by the linked master documentation.

## Architecture

### Part III — Containerization

---

### 22. Containerization Philosophy

Containerization is the foundation of the deployment strategy for Servexa Warranty AI. Every deployable service is packaged as an immutable Docker image to ensure consistency across local development, CI, staging, and production.

Core principles:

* Build once, deploy everywhere
* Immutable artifacts
* Service isolation
* Environment-independent execution
* Consistent runtime behavior

---

### 23. Container Architecture

Each deployable application owns its own container image.

```text
apps/
├── web/
│   └── Dockerfile
├── server/
│   └── Dockerfile
└── ai-services/
    └── Dockerfile
```

Infrastructure services are provisioned separately:

* PostgreSQL
* Redis
* Object Storage
* Cloud Run

---

### 24. Container Responsibilities

#### Web Container

Responsibilities:

* React application
* Static asset serving
* Production frontend build

Deployment Target:

* Cloud Run

---

#### Express Container

Responsibilities:

* REST APIs
* Authentication
* Business Logic
* Streaming Gateway
* Workflow APIs

Deployment Target:

* Cloud Run

---

#### AI Runtime Container

Responsibilities:

* FastAPI
* LangGraph
* RAG
* Tool Execution
* UI Generation
* Event Production

Deployment Target:

* Cloud Run

---

### 25. Dockerfile Guidelines

Every Dockerfile should follow common standards.

Requirements:

* Multi-stage build
* Minimal runtime image
* Non-root execution
* Build cache optimization
* Layer reuse
* Health check support

Avoid:

* Development dependencies in production
* Large base images
* Runtime package installation

---

### 26. Image Versioning

Images should follow semantic versioning combined with Git commit references.

Example:

```text
servexa-web:v1.2.0
servexa-server:v1.2.0
servexa-ai:v1.2.0
```

Development builds may additionally use:

* latest
* commit SHA
* pull request number

---

### 27. Container Registry

Container images are stored in Google Artifact Registry.

Benefits:

* Native Cloud Run integration
* Secure authentication
* Version management
* Regional repositories
* Vulnerability scanning

---

### 28. Build Optimization

The build process should maximize cache utilization.

Optimization techniques:

* Dependency layer caching
* Multi-stage builds
* Separate dependency installation
* Minimal runtime layers

Expected outcomes:

* Faster CI
* Smaller images
* Lower deployment time

---

### 29. Runtime Configuration

Containers remain immutable.

Runtime behavior is configured through:

* Environment Variables
* Cloud Run Configuration
* Secret Manager
* Service Configuration

Containers must never contain environment-specific values.

---

### 30. Container Security

Recommended practices:

* Non-root user
* Read-only filesystem where possible
* Minimal permissions
* Dependency scanning
* Regular base image updates
* Secret injection at runtime

---

## Design Principles

Apply the approved boundaries, ownership rules, and status classifications preserved in this handbook.

## Implementation

Implementation details remain governed by the architecture and contracts referenced above.

## Best Practices

Keep current decisions separate from Planned Evolution and Enterprise Vision material.

## Future Evolution

Future changes require the review and ADR controls described in the related documents.

## References

- [Legacy source](../../documents/4.platform/DEVOPS_MASTER_PLAN.md)

## Related ADRs

- [ADR-001: AI-native architecture](../adr/ADR-001-ai-native-architecture.md)
- [ADR-011: Cloud Run deployment strategy](../adr/ADR-011-cloud-run-deployment-strategy.md)

## Related Documents

- [DevOps Master Plan](./DEVOPS_MASTER_PLAN.md)
- [Technical Master Plan](../architecture/TECHNICAL_MASTER_PLAN.md)
- [Roadmap Master](../roadmap/ROADMAP_MASTER.md)
- [Deployment Runbook](../runbooks/deployment.md)
