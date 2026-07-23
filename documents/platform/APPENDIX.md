# Platform Appendix

> Canonical handbook. The preserved source material remains under `documents/`.

## Purpose

Preserve platform reference matrices and documentation relationships.

## Scope

Technology stack, service responsibilities, runbook references, ADR references, and companion documents.

## Dependencies

Canonical definitions, decisions, and procedures remain in the glossary, ADRs, and runbooks.

## Background

Background is provided by the linked master documentation.

## Architecture

The canonical architecture is defined in the related handbooks below.

## Design Principles

Apply the approved boundaries, ownership rules, and status classifications preserved in this handbook.

## Implementation

### Appendices

---

### Appendix A — Technology Stack Reference

#### Frontend

* React
* TypeScript
* Vite

#### Backend

* Express.js
* Node.js

#### AI Platform

* FastAPI
* LangGraph

#### Database

* PostgreSQL
* pgvector

#### Cache

* Redis

#### Event Bus

* Redis Streams

#### Notifications

* Redis Pub/Sub

#### CI/CD

* GitHub Actions
* Cloud Build

#### Deployment

* Docker
* Cloud Run

---

### Appendix B — Service Responsibility Matrix

| Service       | Primary Responsibility |
| ------------- | ---------------------- |
| React         | User Interface         |
| Express       | Business Platform      |
| FastAPI       | AI Runtime             |
| PostgreSQL    | Business Data          |
| pgvector      | Knowledge Retrieval    |
| Redis         | Shared State           |
| Redis Streams | Event Bus              |
| Cloud Run     | Application Hosting    |

Each service owns a clearly defined responsibility and should avoid overlapping concerns.

---

### Appendix F — Operational Runbook Reference

Operational procedures should be maintained separately from architecture documentation.

Typical runbooks include:

* Service Startup
* Deployment
* Rollback
* Database Recovery
* Redis Recovery
* Incident Response
* AI Runtime Recovery
* Scaling Operations

Each runbook should define prerequisites, step-by-step procedures, validation steps, and rollback actions.

---

### Appendix G — Architecture Decision References

Major architectural decisions should be documented using Architecture Decision Records (ADRs).

Typical ADR topics include:

* Express as Business Platform
* FastAPI as AI Runtime
* LangGraph for Workflow Orchestration
* PostgreSQL + pgvector
* Redis Streams as Event Bus
* Server-Sent Events for Streaming
* Cloud Run Deployment Strategy

Each ADR should record:

* Context
* Decision
* Alternatives Considered
* Consequences
* Status
* Date

---

### Appendix I — Recommended Companion Documents

This document should be used together with the following architecture documentation:

* `ROADMAP_MASTER.md` — Product vision, roadmap, and capability evolution.
* `TECHNICAL_MASTER_PLAN.md` — Application architecture and engineering implementation.
* `DEVOPS_MASTER_PLAN.md` — Platform engineering, infrastructure, deployment, and operations.
* Architecture Decision Records (ADR) — Design decisions and technical trade-offs.
* Design Documents — Feature-level implementation specifications.
* Runbooks — Operational procedures and incident response guides.
* Postmortems — Production incident analysis and continuous improvement records.

Together, these documents form the complete engineering knowledge base for the Servexa Warranty AI platform.

## Best Practices

Keep current decisions separate from Planned Evolution and Enterprise Vision material.

## Future Evolution

Future changes require the review and ADR controls described in the related documents.

## References

- [Legacy source](../../documents/4.platform/DEVOPS_MASTER_PLAN.md)

## Related ADRs

- [ADR-001: AI-native architecture](../adr/ADR-001-ai-native-architecture.md)
- [ADR-002: PostgreSQL and Redis state ownership](../adr/ADR-002-postgresql-and-redis-state-ownership.md)
- [ADR-003: Fixed-schema Generative UI](../adr/ADR-003-fixed-schema-generative-ui.md)
- [ADR-004: Server-Sent Events streaming](../adr/ADR-004-server-sent-events-streaming.md)
- [ADR-005: Retrieval-Augmented Generation](../adr/ADR-005-retrieval-augmented-generation.md)
- [ADR-006: Tool Registry and Tool Calling](../adr/ADR-006-tool-registry-and-tool-calling.md)
- [ADR-007: Human-in-the-loop workflow](../adr/ADR-007-human-in-the-loop-workflow.md)
- [ADR-008: Polyglot persistence](../adr/ADR-008-polyglot-persistence.md)
- [ADR-009: Monorepo architecture](../adr/ADR-009-monorepo-architecture.md)
- [ADR-010: Event-driven AI runtime](../adr/ADR-010-event-driven-ai-runtime.md)
- [ADR-011: Cloud Run deployment strategy](../adr/ADR-011-cloud-run-deployment-strategy.md)

## Related Documents

- [DevOps Master Plan](./DEVOPS_MASTER_PLAN.md)
- [Technical Master Plan](../architecture/TECHNICAL_MASTER_PLAN.md)
- [Roadmap Master](../roadmap/ROADMAP_MASTER.md)
- [Deployment Runbook](../runbooks/deployment.md)
