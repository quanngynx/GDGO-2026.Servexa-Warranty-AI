# AI Deployment

> Canonical handbook. The preserved source material remains under `documents/`.

## Purpose

Define AI runtime deployment, scaling, configuration, and evolution.

## Scope

Deployment responsibilities and operational scaling without duplicating AI runtime internals.

## Dependencies

AI internals are canonical in AI_RUNTIME.md; events and state use their architecture handbooks.

## Background

Background is provided by the linked master documentation.

## Architecture

### Part VIII — AI Platform Deployment

---

### 72. AI Deployment Philosophy

The AI platform is deployed as an independent runtime.

Business logic remains inside Express.

AI intelligence remains inside FastAPI.

This separation enables independent scaling and deployment.

---

### 81. AI Scaling Strategy

The current deployment uses a single AI Runtime instance.

The architecture supports future horizontal scaling because:

* Services are stateless
* Workflow checkpoints are stored externally
* Shared State is externalized
* Events are centralized in Redis Streams

Future deployment:

```text
Cloud Run

      │

 ┌────┼────┐

 ▼    ▼    ▼

AI-1 AI-2 AI-3

      │

 PostgreSQL

 Redis

 pgvector
```

---

### 82. AI Runtime Configuration

The AI Runtime is configured through environment variables.

Typical configuration includes:

* LLM Provider
* Model Name
* Embedding Model
* PostgreSQL
* Redis
* API Endpoints
* Token Limits
* Timeout Settings

Configuration changes should not require rebuilding container images.

---

### 83. Future AI Evolution

The AI platform is intentionally designed to evolve.

Potential future enhancements include:

* Multi-Agent Architecture
* MCP Tool Integration
* Multiple Model Providers
* Distributed LangGraph Execution
* AI Gateway
* Automatic Model Routing
* Agent Collaboration
* Long-term Memory Services

These capabilities represent future evolution and are not part of the current MVP implementation.

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
- [ADR-010: Event-driven AI runtime](../adr/ADR-010-event-driven-ai-runtime.md)
- [ADR-011: Cloud Run deployment strategy](../adr/ADR-011-cloud-run-deployment-strategy.md)

## Related Documents

- [DevOps Master Plan](./DEVOPS_MASTER_PLAN.md)
- [Technical Master Plan](../architecture/TECHNICAL_MASTER_PLAN.md)
- [Roadmap Master](../roadmap/ROADMAP_MASTER.md)
- [Deployment Runbook](../runbooks/deployment.md)
- [AI Runtime](../architecture/AI_RUNTIME.md)
