# Development Environment

> Canonical handbook. The preserved source material remains under `documents/`.

## Purpose

Define reproducible local development and environment configuration.

## Scope

Repository layout, local topology, Docker Compose, dependencies, profiles, secrets, and workflows.

## Dependencies

Runtime-specific configuration remains owned by the relevant architecture handbook.

## Background

Background is provided by the linked master documentation.

## Architecture

The canonical architecture is defined in the related handbooks below.

## Design Principles

Apply the approved boundaries, ownership rules, and status classifications preserved in this handbook.

## Implementation

### Part II — Development Environment

---

### 10. Development Philosophy

The development environment should be:

* Simple
* Consistent
* Reproducible
* Containerized
* Platform independent

Every developer should be able to clone the repository and start developing with minimal manual configuration.

---

### 11. Repository Structure

The project follows a monorepo architecture.

Example structure:

```text
apps/
    web/
    server/
    ai-services/

packages/
    shared/
    event-contracts/
    ui/
    config/

docker/

docs/

scripts/
```

Benefits include:

* Shared code
* Shared configuration
* Consistent dependency management
* Simplified refactoring

---

### 12. Development Stack

Primary technologies:

| Layer           | Technology          |
| --------------- | ------------------- |
| Frontend        | React + TypeScript  |
| Backend         | Express.js          |
| AI Runtime      | FastAPI + LangGraph |
| Database        | PostgreSQL          |
| Vector Database | pgvector            |
| Cache           | Redis               |
| Event Bus       | Redis Streams       |
| Package Manager | pnpm                |
| Containers      | Docker              |

---

### 13. Local Development Architecture

```text
React

↓

Express

↓

FastAPI

↓

PostgreSQL

↓

Redis

↓

pgvector
```

Developers should be able to run the complete stack locally.

---

### 14. Environment Configuration

Configuration should be managed using environment variables.

Typical categories include:

* Application
* Database
* Redis
* AI
* Authentication
* Storage
* Logging
* Monitoring

Sensitive values must never be committed to source control.

---

### 15. Docker Strategy

Docker is the standard runtime for local development.

Containers should provide:

* Consistent dependencies
* Repeatable environments
* Easy onboarding
* Isolation between services

Each major service should have its own Dockerfile.

---

### 16. Docker Compose

Docker Compose is used to orchestrate local infrastructure.

Typical services include:

* PostgreSQL
* Redis
* pgvector-enabled database
* Optional development utilities

Application services may be run either locally or inside containers depending on the development workflow.

---

### 17. Dependency Management

The project uses **pnpm** as the package manager for JavaScript and TypeScript projects.

Benefits include:

* Workspace support
* Faster installation
* Reduced disk usage
* Deterministic dependency resolution

Python dependencies are managed independently using the AI service's Python package management workflow.

---

### 18. Environment Profiles

The platform supports multiple execution environments.

| Environment | Purpose                    |
| ----------- | -------------------------- |
| Local       | Daily development          |
| Development | Shared development server  |
| Staging     | Integration testing        |
| Production  | Customer-facing deployment |

Each environment maintains its own configuration and secrets.

---

### 19. Secrets Management

Secrets should never be stored in the repository.

Examples include:

* Database credentials
* Redis passwords
* JWT secrets
* API keys
* LLM provider credentials
* Cloud service credentials

Secrets are managed through environment-specific secret stores.

---

### 20. Local Development Workflow

Typical workflow:

```text
Clone Repository

↓

Install Dependencies

↓

Configure Environment

↓

Start Infrastructure

↓

Run Services

↓

Develop

↓

Test

↓

Commit

↓

Push
```

Developers should be able to iterate quickly without requiring changes to shared infrastructure.

---

### 21. Development Standards

All contributors should follow consistent development practices.

These include:

* Feature branch workflow
* Code formatting
* Static analysis
* Unit testing
* Type checking
* Documentation updates
* Pull request reviews

The development environment should enforce these standards as early as possible to reduce integration issues during CI/CD.

### Appendix C — Environment Matrix

| Component  | Local | Development | Staging | Production |
| ---------- | ----- | ----------- | ------- | ---------- |
| React      | ✓     | ✓           | ✓       | ✓          |
| Express    | ✓     | ✓           | ✓       | ✓          |
| FastAPI    | ✓     | ✓           | ✓       | ✓          |
| PostgreSQL | ✓     | ✓           | ✓       | ✓          |
| Redis      | ✓     | ✓           | ✓       | ✓          |
| pgvector   | ✓     | ✓           | ✓       | ✓          |

Every environment should mirror production as closely as practical while remaining appropriate for its intended purpose.

---

### Appendix D — Configuration Categories

Application Configuration

* Environment
* Feature Flags
* Build Configuration

Database Configuration

* PostgreSQL
* Connection Pool
* Migration Settings

Redis Configuration

* Cache
* Streams
* Pub/Sub

AI Configuration

* LLM Provider
* Embedding Model
* Token Limits
* Timeout
* Context Window

Security Configuration

* JWT
* Secrets
* API Keys

Infrastructure Configuration

* Cloud Run
* Networking
* Scaling
* Monitoring

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
