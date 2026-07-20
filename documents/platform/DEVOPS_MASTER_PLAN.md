# Part I — Platform Overview

---

# 1. Vision

The DevOps platform of **Servexa Warranty AI** is designed to provide a reliable, repeatable, and scalable software delivery process for a modern AI-powered enterprise application.

Unlike traditional CRUD systems, the platform consists of multiple independently deployable services that must evolve together while maintaining consistent API contracts and deployment workflows.

Current platform components include:

* React Web Application
* Express Business Backend
* FastAPI AI Runtime
* PostgreSQL
* pgvector
* Redis
* Redis Streams
* Cloud Run
* GitHub Actions
* Cloud Build

The platform is designed around the following philosophy:

* Cloud-native
* Container-first
* API-first
* Event-driven
* AI-ready
* Observable
* Secure by default

---

# 2. Goals

The DevOps platform aims to achieve the following objectives.

## Development

* Fast local development
* Consistent development environments
* Reproducible builds
* Minimal onboarding effort

## Delivery

* Automated CI pipelines
* Reliable deployments
* Safe production releases
* Fast rollback

## Operations

* Centralized logging
* Health monitoring
* Cost visibility
* Failure recovery

## Scalability

* Independent service deployment
* Stateless application services
* Event-driven communication
* Horizontal scaling readiness

---

# 3. Engineering Principles

The platform follows several engineering principles that apply across all services.

## Container-first

Every deployable component must run inside a Docker container.

Local development and production should use the same containerized runtime whenever possible.

---

## Immutable Deployments

Each deployment is built once and promoted across environments.

Containers are never modified after deployment.

---

## Infrastructure as Configuration

Environment-specific behavior is controlled through configuration instead of source code modifications.

Examples include:

* Environment variables
* Cloud Run configuration
* GitHub Secrets
* Cloud Build substitutions

---

## Automation First

Manual operational work should be minimized.

Automation includes:

* Build
* Testing
* Linting
* Deployment
* Health validation
* Rollback preparation

---

## Event-driven Architecture

Internal communication between services should support asynchronous processing where appropriate.

Redis Streams serves as the primary event backbone for workflow execution.

---

## Observability by Default

Every service should expose sufficient telemetry for:

* Logs
* Metrics
* Health checks
* Error reporting
* Distributed tracing

---

## Security by Design

Security is considered during platform design rather than added later.

Key principles include:

* Least privilege
* Secret isolation
* Secure service communication
* Protected deployment pipelines

---

# 4. Platform Architecture

The platform is organized into several logical layers.

```text
                        React Web
                            │
                            ▼
                    Express API Gateway
                    Business Platform
                            │
            ┌───────────────┴───────────────┐
            ▼                               ▼
     Business Services               FastAPI AI Runtime
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    ▼                       ▼                       ▼
              PostgreSQL                Redis                  pgvector
```

Each layer has clearly defined responsibilities.

---

# 5. Core Platform Components

## Frontend

Technology:

* React
* TypeScript
* Vite

Responsibilities:

* User Interface
* SSE Client
* Shared State Consumer
* Event Processing

---

## Business Backend

Technology:

* Express.js
* Node.js

Responsibilities:

* Authentication
* Authorization
* Business APIs
* Workflow APIs
* Streaming Gateway

---

## AI Runtime

Technology:

* FastAPI
* LangGraph

Responsibilities:

* Planning
* Context Building
* Tool Execution
* RAG
* Reasoning
* UI Generation

---

## Data Layer

Primary database:

* PostgreSQL

Vector search:

* pgvector

Caching:

* Redis

Event Bus:

* Redis Streams

Notification:

* Redis Pub/Sub

---

# 6. Platform Philosophy

The platform separates responsibilities into three independent domains.

## Business Domain

Owned by Express.

Responsible for:

* Business rules
* CRUD
* Workflow APIs
* Authentication

---

## AI Domain

Owned by FastAPI.

Responsible for:

* AI orchestration
* Agent workflow
* Retrieval
* Tool planning
* Reasoning

---

## Infrastructure Domain

Responsible for:

* Containers
* Networking
* Deployment
* Monitoring
* Scaling
* Disaster recovery

---

# 7. Deployment Philosophy

The deployment strategy follows several principles.

* Services are independently deployable.
* Deployments are container-based.
* Production deployments require validation.
* Rollbacks should be straightforward.
* Infrastructure changes should not require application changes.

---

# 8. Current Platform Scope

The current implementation focuses on a production-ready MVP suitable for hackathons and early customer validation.

Current assumptions include:

* Single Express instance
* Single FastAPI instance
* Single PostgreSQL database
* Single Redis deployment
* Cloud Run deployment
* Docker-based delivery
* GitHub Actions CI
* Cloud Build deployment

---

# 9. Future Platform Evolution

The architecture intentionally supports future expansion without requiring major redesign.

Potential future improvements include:

* Multi-region deployment
* Kubernetes orchestration
* Multi-AI Runtime
* Service Mesh
* Distributed Event Bus
* Infrastructure as Code
* GitOps deployment
* Multi-cloud support

These capabilities are considered future enhancements and are not part of the current implementation.

---


# Canonical Platform Map

| Topic | Canonical handbook |
| --- | --- |
| Development environment | [DEVELOPMENT_ENVIRONMENT.md](./DEVELOPMENT_ENVIRONMENT.md) |
| Containerization | [CONTAINERIZATION.md](./CONTAINERIZATION.md) |
| Continuous integration | [CI_PIPELINE.md](./CI_PIPELINE.md) |
| Continuous delivery | [CD_PIPELINE.md](./CD_PIPELINE.md) |
| Deployment architecture | [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md) |
| Infrastructure | [INFRASTRUCTURE.md](./INFRASTRUCTURE.md) |
| AI deployment | [AI_DEPLOYMENT.md](./AI_DEPLOYMENT.md) |
| Performance and cost | [PERFORMANCE.md](./PERFORMANCE.md) |
| Disaster recovery | [DISASTER_RECOVERY.md](./DISASTER_RECOVERY.md) |
| Future evolution | [FUTURE_EVOLUTION.md](./FUTURE_EVOLUTION.md) |
| Platform reference material | [APPENDIX.md](./APPENDIX.md) |
