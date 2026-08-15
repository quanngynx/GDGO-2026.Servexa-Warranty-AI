# Infrastructure

> Canonical handbook. The preserved source material remains under `documents/`.

## Purpose

Define shared infrastructure services and data ownership.

## Scope

PostgreSQL, pgvector, Redis, Redis Streams, Redis Pub/Sub, scaling, and ownership.

## Dependencies

Semantic behavior for events and shared state remains canonical in architecture.

## Background

Background is provided by the linked master documentation.

## Architecture

### Part VII — Infrastructure

---

### 63. Infrastructure Overview

The platform infrastructure provides the shared foundation for application services.

Core infrastructure components include:

* PostgreSQL
* pgvector
* Redis
* Redis Streams
* Cloud Run
* Artifact Registry
* Cloud Build
* GitHub Actions

Infrastructure components remain independent from application deployments.

---

### 64. PostgreSQL

PostgreSQL serves as the primary relational database.

Responsibilities:

* Business Data
* Workflow Metadata
* LangGraph Checkpoints
* Audit Logs
* User Management

Business data is exclusively owned by the Express backend.

---

### 65. pgvector

pgvector extends PostgreSQL with vector similarity search.

Responsibilities:

* Embedding Storage
* Semantic Search
* Knowledge Retrieval
* Similarity Search

The AI Runtime accesses pgvector directly without routing through Express.

---

### 66. Redis

Redis provides high-speed in-memory storage.

Responsibilities:

* Shared State
* Session Cache
* AI Context Cache
* Conversation Cache
* Temporary Data

Redis is not the source of truth for business information.

---

### 67. Redis Streams

Redis Streams functions as the platform event bus.

Primary use cases:

* Workflow Events
* AI Events
* Long-running Tasks
* Resume Events
* Background Processing

Redis Streams provides:

* Event ordering
* Consumer groups
* Retry support
* Event replay

---

### 68. Redis Pub/Sub

Redis Pub/Sub is reserved for lightweight notifications.

Typical usage:

* UI notifications
* Cache invalidation
* Internal service notifications

It should not be used for workflow orchestration.

---

### 69. Shared Infrastructure Services

Shared platform services include:

* Container Registry
* Secret Management
* DNS
* HTTPS Certificates
* Logging
* Monitoring

These services support all application workloads.

---

### 70. Infrastructure Scaling

Current infrastructure targets a production-ready MVP.

Current assumptions:

* Single PostgreSQL instance
* Single Redis deployment
* Single AI Runtime
* Single Express deployment

Future scalability:

* Read replicas
* Redis Cluster
* Multi-region deployment
* Distributed AI Runtime

---

### 71. Data Ownership

Each infrastructure component owns a specific category of data.

| Data              | Owner         | Storage    |
| ----------------- | ------------- | ---------- |
| Customer Data     | Express       | PostgreSQL |
| Warranty Data     | Express       | PostgreSQL |
| Workflow Snapshot | LangGraph     | PostgreSQL |
| Knowledge Base    | AI Runtime    | pgvector   |
| Shared State      | Redis         | Redis      |
| Events            | Redis Streams | Redis      |
| Audit Logs        | Express       | PostgreSQL |

Maintaining clear ownership prevents duplicated business logic.

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

- [ADR-002: PostgreSQL and Redis state ownership](../adr/ADR-002-postgresql-and-redis-state-ownership.md)
- [ADR-008: Polyglot persistence](../adr/ADR-008-polyglot-persistence.md)
- [ADR-010: Event-driven AI runtime](../adr/ADR-010-event-driven-ai-runtime.md)

## Related Documents

- [DevOps Master Plan](./DEVOPS_MASTER_PLAN.md)
- [Technical Master Plan](../architecture/TECHNICAL_MASTER_PLAN.md)
- [Roadmap Master](../roadmap/ROADMAP_MASTER.md)
- [Deployment Runbook](../runbooks/deployment.md)
