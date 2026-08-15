# Observability

> Canonical handbook. The preserved source material remains under `documents/`.

## Purpose

Define observability across application, AI, business, and platform surfaces.

## Scope

Logs, metrics, traces, health checks, alerting, monitoring, and dashboards.

## Dependencies

All runtime services propagate correlation identifiers through synchronous and asynchronous boundaries.

## Background

Background is provided by the linked master documentation.

## Architecture

### 26. Observability

#### Architecture Status

| Architecture Horizon | Implementation Status | Note |
| --- | --- | --- |
| Current Decision | Partial | Logging exists, while unified metrics, traces, dashboards and alerting are incomplete. |

#### Overview

Cross-cutting logging, metrics, tracing and monitoring policy is defined in [Cross-cutting Concerns](./APPENDIX.md#23c-cross-cutting-concerns). This chapter contains observability-specific implementation guidance.

Một hệ thống AI không thể vận hành ổn định nếu chỉ theo dõi CPU và RAM.

Servexa Warranty AI cần quan sát cả:

- Business Workflow
- AI Workflow
- Tool Calling
- Retrieval
- Streaming
- User Interaction

---

#### Observability Stack

```text
[Component Diagram]
Application

↓

Logs

↓

Metrics

↓

Tracing

↓

Dashboard

↓

Alert
```

---

#### Logging

Mọi log đều có:

- request_id
- workflow_id
- conversation_id
- user_id
- timestamp

---

#### Metrics

Theo dõi:

##### System

- CPU
- Memory
- Disk
- Network

---

##### Backend

- Request Rate
- Error Rate
- Latency

---

##### AI

- Prompt Tokens
- Completion Tokens
- Tool Calls
- Retrieval Time
- Generation Time

---

#### Distributed Tracing

Một Request có thể đi qua:

Frontend

↓

Express Gateway

↓

FastAPI AI Runtime

↓

FastAPI Tool Executor

↓

Express Business API

↓

PostgreSQL

↓

FastAPI → Redis Streams → Express SSE → Frontend

Tracing giúp xác định bottleneck.

---

#### AI Monitoring

Theo dõi:

- Hallucination Rate
- Citation Coverage
- Tool Success Rate
- Retry Count
- Confidence Distribution

---

#### Business Monitoring

Ví dụ:

- Warranty Approved
- Warranty Rejected
- Average Resolution Time
- Human Approval Rate

---

#### Alerting

Ví dụ:

- AI Error Spike
- Database Down
- Retrieval Failure
- Tool Timeout
- High Token Cost

---

#### Dashboard

Dashboard nên bao gồm:

- System Health
- AI Metrics
- Business Metrics
- Cost
- Streaming Status

---

#### Deliverables

- Logging Framework
- Metrics
- Tracing
- AI Dashboard
- Alert Rules

---

### Part IX — Observability

---

### 84. Observability Philosophy

Observability is a foundational capability of the platform rather than an operational afterthought. Every service must expose sufficient telemetry to understand system behavior, diagnose failures, and measure business impact.

The observability strategy is built upon four pillars:

* Logging
* Metrics
* Tracing
* Health Monitoring

Together, these pillars provide complete visibility across the entire platform.

---

### 85. Observability Architecture

```text
React
    │
Express
    │
FastAPI
    │
──────────────────────────────
Logs
Metrics
Traces
Health Checks
──────────────────────────────
        │
        ▼
Monitoring Platform
        │
Dashboards
Alerts
Incident Response
```

Every service contributes telemetry to a centralized monitoring platform.

---

### 86. Logging Strategy

Logging should be structured, searchable, and machine-readable.

Every log entry should contain:

* Timestamp
* Service Name
* Environment
* Request ID
* Workflow ID
* Conversation ID
* User ID (when applicable)
* Log Level
* Message
* Exception Details

Recommended log levels:

* DEBUG
* INFO
* WARN
* ERROR
* FATAL

Sensitive information must never appear in application logs.

---

### 87. Metrics

Platform metrics should cover infrastructure, application, and AI runtime performance.

Infrastructure Metrics

* CPU Usage
* Memory Usage
* Container Restarts
* Network Traffic

Application Metrics

* Request Count
* Request Latency
* Error Rate
* Active Users

AI Metrics

* Prompt Count
* Completion Count
* Tool Invocations
* Retrieval Count
* Token Consumption
* Model Latency

Business Metrics

* Conversations Started
* Workflows Completed
* Human Approvals
* Suggested Actions Accepted

---

### 88. Distributed Tracing

Every request should be traceable across all services.

Typical trace flow:

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

Each trace should include:

* Trace ID
* Span ID
* Parent Span
* Service Name
* Operation Name
* Duration

This enables end-to-end debugging of distributed workflows.

---

### 89. Health Monitoring

Each service exposes standard health endpoints.

Health categories include:

* Startup
* Liveness
* Readiness
* Dependency Health

Dependency validation includes:

* PostgreSQL
* Redis
* AI Runtime
* Internal APIs

Health endpoints should be lightweight and deterministic.

---

### 90. Alerting Strategy

Alerts should be actionable and prioritized.

Critical Alerts

* Service unavailable
* Database unavailable
* Redis unavailable
* AI Runtime unavailable

Major Alerts

* High error rate
* Increased latency
* Failed deployments
* Workflow failures

Informational Alerts

* High resource usage
* Scaling events
* Deployment completed

Alert fatigue should be minimized through meaningful thresholds.

---

### 91. Dashboard Strategy

Dashboards should be organized by audience.

Engineering Dashboard

* Deployment Status
* API Health
* Infrastructure Metrics
* Error Rates

AI Operations Dashboard

* Active Conversations
* Tool Usage
* Model Performance
* Token Consumption

Business Dashboard

* Daily Conversations
* Workflow Success Rate
* Human Approval Rate
* Feature Adoption

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

- [Legacy source](../../documents/TECHNICAL_MASTER_PLAN.md)
- [Legacy source](../../documents/4.platform/DEVOPS_MASTER_PLAN.md)

## Related ADRs

- [ADR-010: Event-driven AI runtime](../adr/ADR-010-event-driven-ai-runtime.md)
- [ADR-011: Cloud Run deployment strategy](../adr/ADR-011-cloud-run-deployment-strategy.md)

## Related Documents

- [Technical Master Plan](./TECHNICAL_MASTER_PLAN.md)
- [Roadmap Master](../roadmap/ROADMAP_MASTER.md)
- [DevOps Master Plan](../platform/DEVOPS_MASTER_PLAN.md)
- [Glossary](../glossary/GLOSSARY.md)
