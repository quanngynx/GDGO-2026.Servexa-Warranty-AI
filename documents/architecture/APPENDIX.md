# Architecture Appendix

> Canonical handbook. The preserved source material remains under `documents/`.

## Purpose

Preserve cross-cutting architecture, governance, testing, and technology-selection material.

## Scope

NFRs, failure scenarios, configuration, testing, engineering guidance, risks, ADR governance, and schemas.

## Dependencies

Operational procedures and platform implementation remain canonical in their dedicated documents.

## Background

Background is provided by the linked master documentation.

## Architecture

### Part V. DevOps & Operations

---

<a id="23a-non-functional-requirements"></a>

### 23A. Non-functional Requirements

#### Architecture Status

| Architecture Horizon | Implementation Status |
| --- | --- |
| Current Decision | Partial |
| Planned Evolution | Production measurement, alert thresholds and approved SLOs |
| Enterprise Vision | Multi-region and distributed-runtime objectives |

The following are architecture requirements. Existing latency values are design targets, not measured production SLOs.

| Quality | Current requirement | Measurement / evidence |
| --- | --- | --- |
| Performance | First response `< 2s`, first token `< 1s`, Tool `< 3s`, retrieval `< 500ms`, UI update `< 100ms` | Traces and percentile dashboards |
| Scalability | React/Express are designed for stateless scale; the current boundary is one FastAPI runtime, with scale-out only after Planned Evolution validation | Load test and saturation metrics |
| Availability | No percentage is claimed until an SLA is approved | Health checks, dependency probes, incident history |
| Reliability | Idempotency, bounded retry, checkpoint/resume, DLQ, no silent data loss | Retry/DLQ metrics and recovery tests |
| Security | Authentication and authorization at Express, least privilege, tenant-scoped retrieval | Security tests and audit logs |
| Cost | Token/context budgets, cache only safe intermediate results, asynchronous heavy work | Cost per workflow and provider usage |
| Observability | Correlated request/workflow/conversation IDs across services | Structured logs, metrics and distributed traces |
| Maintainability | Versioned contracts, ADRs, quarterly handbook review | Compatibility tests and review history |

### 23B. Failure Scenarios

| Failure | Detection | Degraded behavior / recovery | Retry policy | Data consistency | User impact |
| --- | --- | --- | --- | --- | --- |
| FastAPI unavailable | Express health probe, timeout and error-rate alert | Business APIs remain available; AI workflow start/resume returns structured unavailable response | Bounded transient retry; no unbounded browser retry | No business mutation is inferred from a failed AI call | AI features unavailable; business UI remains usable |
| Redis unavailable | Connection probe, stream lag and command errors | Stop new async workflow delivery and SSE projection; restore from PostgreSQL/checkpoint after recovery | Client reconnect with bounded backoff | Never fall back to process memory as authoritative state | Streaming and async workflows pause |
| PostgreSQL unavailable | Prisma/checkpointer probe and transaction failures | Reject business writes and LangGraph start/resume; recover through database operations procedure | Retry connection, not an unknown transaction result | Fail closed; never acknowledge an uncommitted action | Business mutations and resumable workflows unavailable |
| pgvector timeout | Retrieval timeout and trace span | Return structured `evidence_unavailable`; do not create a grounded recommendation | Bounded retrieval retry within workflow budget | No fabricated Evidence or eligibility result | User sees insufficient evidence and retry guidance |
| Tool timeout | Tool deadline, missing completion event | Return structured timeout; async idempotent work may requeue | Only transient, idempotent operations retry | Idempotency key prevents duplicate business action | Partial workflow with explicit failed step |
| LLM failure | Provider timeout/error and generation trace | Preserve validated Evidence/Tool Results; mark generation failed | Bounded provider retry within cost/latency budget | Never invent output or auto-approve | Partial results remain visible; final response fails safely |

<a id="23c-cross-cutting-concerns"></a>

### 23C. Cross-cutting Concerns

This chapter is the canonical policy location. Component chapters document only deviations.

| Concern | Canonical policy | Owner |
| --- | --- | --- |
| Authentication | JWT/session validation at Express ingress | Express |
| Authorization | RBAC/resource policy before business reads and writes | Express |
| Validation | Validate API, Event, Tool, Shared State and UI Schema boundaries | Producing and receiving service |
| Rate limiting | Apply at Express ingress; worker concurrency limits protect async paths | Express / infrastructure |
| Logging | Structured logs with request, workflow, conversation, actor and service IDs | All runtimes |
| Metrics | Request, workflow, retrieval, Tool, stream, DLQ, model and business metrics | All runtimes |
| Distributed tracing | Propagate trace ID through HTTP, Redis Streams and Tool calls | Express / FastAPI / workers |
| Error handling | Versioned safe error envelope; never expose secrets, prompts or stack traces | All runtimes |
| Configuration | Typed environment schema; secrets outside source control | Component owner |
| Monitoring | Health, dependency, error-rate, latency, queue lag and cost alerts | Operations |

<a id="23d-ai-safety--governance"></a>

### 23D. AI Safety & Governance

| Control | Required behavior |
| --- | --- |
| Hallucination mitigation | Ground important answers in Evidence or state that Evidence is unavailable |
| Evidence requirement | Preserve source, section/page/chunk, version and tenant scope |
| Confidence | Explain uncertainty; confidence never overrides missing Evidence or business rules |
| Human approval | Risk policy determines approval; Express rechecks authorization and executes |
| Prompt injection | Treat user and retrieved content as untrusted; isolate system/tool instructions |
| Sensitive data | Minimize prompt content, apply tenant scope, redact logs and enforce retention |
| Auditability | Record model, prompt/template, Tool, Evidence, decision and workflow versions |
| Model versioning | Record provider/model identifier; changes require evaluation and change history |
| Prompt versioning | Version managed templates; breaking behavior changes require evaluation |

<a id="23e-configuration-run-modes--contract-versioning"></a>

### 23E. Configuration, Run Modes & Contract Versioning

#### Configuration Matrix

Only names and ownership are documented. Secret values are never copied.

| Component | Configuration categories | Owner | Source of truth | Secret class | Run modes |
| --- | --- | --- | --- | --- | --- |
| Express | port/CORS, PostgreSQL, Redis/streams, auth, RAG flags, uploads/storage, telemetry, HITL, legacy gRPC drift | Express | `packages/env/src/server.ts` | Mixed | Local, Demo, Staging, Production |
| FastAPI | app/model, Redis streams/jobs, Express base URL, PostgreSQL/pgvector, auth/rate limit, tracing, legacy gRPC drift | FastAPI | `apps/ai-services/src/configs/base.py` | Mixed | Local, Demo, Staging, Production |
| PostgreSQL | connection, pool, migration and backup policy | Data platform | Typed service configuration + deployment configuration | Secret | All |
| Redis | endpoint, TLS, DB, stream/group names, retry/DLQ settings | Infrastructure | Typed service configuration | Mixed | All |
| LangGraph | checkpoint enablement, thread/run identity, workflow version | FastAPI | Workflow code and database migrations; no complete typed setting exists yet | Non-secret | All |
| pgvector | collection/index, embedding model and retrieval limits | FastAPI / data platform | FastAPI settings and migration/index definitions | Non-secret | All |
| SSE | keepalive, event version, authorization and reconnect policy | Express | Planned typed Express configuration and event contract; current source matrix is incomplete | Non-secret | Demo, Staging, Production |

#### Operational Run Modes

| Mode | Topology | Guarantees and limits |
| --- | --- | --- |
| Local Development | Services run locally; Docker Compose provides PostgreSQL/pgvector and Redis | Developer convenience; no HA claim |
| Demo | Single-instance containers and isolated demo data | Reproducible presentation; no HA or production SLA |
| Staging | Production-like isolated stores, migrations and observability | Compatibility and recovery validation |
| Production | Independently deployed services with managed persistence | Current single logical runtime/data-store architecture; no multi-region or distributed-AI claim |

#### Contract Versioning

| Contract | Policy |
| --- | --- |
| APIs | Major version in path (`/v1`); breaking change creates `/v2` |
| Events | Envelope `version: "1.0"`; additive optional fields are compatible; breaking payload change increments major |
| Shared State | `major.minor`, initially `1.0`; reject unsupported major and ignore unknown optional fields |
| UI Schema | `major.minor`, initially `1.0`; ignore unknown optional fields and reject unsupported major versions |
| Tool Contracts | `major.minor`, initially `1.0`; ignore unknown optional fields, reject unsupported major versions and increment major for breaking input/output changes |

### Appendix C. Data Schemas

---

## Design Principles

Apply the approved boundaries, ownership rules, and status classifications preserved in this handbook.

## Implementation

### 27. Testing Strategy

#### Overview

Kiến trúc AI yêu cầu nhiều lớp kiểm thử hơn so với hệ thống CRUD truyền thống.

Ngoài Unit Test và Integration Test, cần đánh giá chất lượng của Retrieval, Reasoning và toàn bộ Agent Workflow.

---

#### Testing Pyramid

```text
[Component Diagram]
E2E

↓

Integration

↓

Component

↓

Unit
```

---

#### Backend Testing

Bao gồm:

- Service Test
- Repository Test
- API Test
- Database Test

---

#### Frontend Testing

Bao gồm:

- Component Test
- Rendering Test
- Streaming Test
- Accessibility Test

---

#### AI Testing

##### Prompt Validation

Kiểm tra:

- Required Context
- Missing Variables
- Prompt Injection

---

##### Tool Testing

Kiểm tra:

- Input Schema
- Output Schema
- Permission
- Retry

---

##### Workflow Testing

Đánh giá:

- Planner
- Shared State
- Approval
- Resume

---

#### RAG Evaluation

Bao gồm:

- Recall@K
- Precision@K
- MRR
- Faithfulness
- Citation Accuracy

---

#### UI Evaluation

Kiểm tra:

- Schema Validation
- Renderer
- Streaming
- State Binding

---

#### Regression Testing

Mỗi Release cần:

- Agent Regression
- Workflow Regression
- API Regression

---

#### Load Testing

Đánh giá:

- Concurrent Users
- Streaming Sessions
- Tool Calls
- Vector Search

---

#### Deliverables

- Unit Tests
- Integration Tests
- E2E Tests
- AI Evaluation Suite
- RAG Evaluation
- Performance Test

---

### 29. Maintenance & Operations

#### Architecture Status

| Architecture Horizon | Implementation Status | Note |
| --- | --- | --- |
| Current Decision | Partial | Maintenance policies are approved guidance; automated operational enforcement varies by run mode. |

#### Overview

Configuration ownership, supported run modes and versioning policy are defined in [Configuration, Run Modes & Contract Versioning](#23e-configuration-run-modes--contract-versioning).

Sau khi hệ thống được triển khai, cần có quy trình vận hành chuẩn nhằm đảm bảo khả năng bảo trì lâu dài, giảm rủi ro và duy trì chất lượng dịch vụ.

---

#### Operational Procedures

Bao gồm:

- Incident Response
- Service Restart
- Rollback
- Backup Verification
- Secret Rotation

---

#### AI Operations

Định kỳ:

- cập nhật Knowledge Base;
- đánh giá Prompt;
- đánh giá chất lượng RAG;
- theo dõi Hallucination;
- tối ưu Tool Calling.

---

#### Release Management

Mỗi phiên bản cần:

- Version Number
- Changelog
- Migration Guide
- Rollback Plan

---

#### Documentation

Duy trì:

- Architecture Decision Records (ADR)
- API Documentation
- Deployment Guide
- Runbook
- Troubleshooting Guide

---

#### Operational Checklist

Trước mỗi lần phát hành:

- Build thành công.
- Test đạt yêu cầu.
- Security Scan hoàn tất.
- Migration được xác nhận.
- Monitoring hoạt động.
- Rollback đã sẵn sàng.

---

#### Deliverables

- Operations Handbook
- Runbook
- Incident Response Guide
- Release Checklist
- Maintenance Plan

### Part VI. Engineering Guidelines

---

### 30. Engineering Principles

#### Overview

Servexa Warranty AI không chỉ là một ứng dụng AI mà là một nền tảng (AI Platform) có khả năng mở rộng trong nhiều năm. Vì vậy, mọi quyết định kỹ thuật cần tuân thủ một bộ nguyên tắc thống nhất nhằm đảm bảo chất lượng mã nguồn, khả năng bảo trì và tính nhất quán giữa các thành viên trong nhóm.

Các nguyên tắc dưới đây áp dụng cho toàn bộ repository, bao gồm Frontend, Backend, AI Runtime và Infrastructure.

---

#### Core Principles

- Simplicity over Cleverness.
- Explicit over Implicit.
- Composition over Inheritance.
- Convention over Configuration.
- AI-first but Business-driven.
- Strong Typing.
- Testability.
- Observability by Default.

---

#### Architectural Principles

- Domain-driven Design.
- Clean Architecture.
- Event-driven Communication.
- Stateless Services.
- PostgreSQL as Business Source of Truth; Redis Shared State as coordination source.
- Fixed-schema UI.
- Contract-first Development.

---

#### AI Engineering Principles

- AI never owns business rules.
- AI recommends, humans decide.
- Every recommendation must be explainable.
- Every answer should be grounded by evidence.
- Every tool call must be auditable.
- Every workflow must be resumable.

---

### 31. Repository Structure

#### Monorepo Strategy

Repository được tổ chức theo Monorepo nhằm chia sẻ code, kiểu dữ liệu và contract giữa Frontend, Backend và AI Runtime.

```text
apps/
    web/
    server/
    ai-services/
    fumadocs/

packages/
    ui/
    env/
    ai-contracts/
    event-contracts/
    proto/          # legacy gRPC contracts pending removal; target runtime uses Internal HTTP
    db/
    infra/
    config/

documents/
openwiki/
```

---

#### Layer Responsibilities

##### apps/web

- React Application
- AI Workspace
- Local Shared State Projection
- SSE Client / Event Processor
- Generative UI

---

##### apps/server

- REST API
- Business Logic
- Authentication
- Domain Services

---

##### apps/ai-services

- FastAPI
- LangGraph
- Planner
- Memory
- RAG
- Tool Calling
- Fixed-schema UI Generation

---

##### packages

Không chứa Business Logic.

Chỉ chứa:

- reusable components
- types
- schemas
- utilities
- contracts

---

### 32. Coding Standards

#### Naming Convention

##### Variables

```ts
customerName;
repairOrder;
warrantyStatus;
```

---

##### Components

```text
WarrantyCard
EvidencePanel
ApprovalDialog
```

---

##### Hooks

```text
useSharedState
useStreaming
useWorkflow
```

---

##### Services

```text
WarrantyService
ToolExecutor
KnowledgeService
```

---

#### File Naming

```text
kebab-case

PascalCase.tsx

camelCase.ts
```

---

#### TypeScript Guidelines

- strict mode
- no any
- explicit return type
- readonly where possible
- exhaustive switch

---

#### React Guidelines

- Functional Components
- Custom Hooks
- Composition
- Controlled Components

Không sử dụng:

- Business Logic trong UI
- Anonymous Components
- Deep Prop Drilling

---

#### Backend Guidelines

- Domain-first
- Service Layer
- Repository Pattern
- DTO Validation
- Dependency Injection

---

### 33. Git Workflow

#### Branch Strategy

```text
[Data Flow Diagram]
main

↓

develop

↓

feature/*

↓

pull request

↓

merge
```

---

#### Branch Naming

```text
feature/

fix/

refactor/

docs/

hotfix/
```

---

#### Commit Convention

Áp dụng Conventional Commits.

Ví dụ:

```text
feat:

fix:

refactor:

docs:

test:

chore:
```

---

#### Pull Request Rules

PR phải:

- build thành công;
- test thành công;
- review tối thiểu một người;
- không có conflict;
- cập nhật documentation nếu cần.

---

### 34. API Guidelines

#### REST Principles

- Resource-oriented
- Stateless
- Versioned
- Idempotent

---

#### Naming

```text
GET /warranties

POST /repair-orders

PATCH /approvals/{id}
```

---

#### Response Format

```json
{
  "success": true,
  "data": {},
  "metadata": {}
}
```

---

#### Error Format

```json
{
  "error": {
    "code": "",
    "message": "",
    "details": []
  }
}
```

---

#### Streaming Events

Mỗi Event cần:

- version
- id
- type
- workflowId
- conversationId
- timestamp
- payload

---

### 35. Logging Guidelines

#### Log Levels

- DEBUG
- INFO
- WARN
- ERROR
- FATAL

---

#### Structured Logging

Mỗi log bao gồm:

- request_id
- workflow_id
- user_id
- service
- duration

---

#### Không ghi log

- Password
- JWT
- API Key
- Prompt nội bộ
- Chain of Thought

---

### 36. Error Handling

#### Error Categories

- Validation
- Authentication
- Authorization
- Business
- Infrastructure
- AI Runtime

---

#### Error Principles

Không expose:

- Stack Trace
- Internal Prompt
- Database Error

Người dùng chỉ nhận thông báo phù hợp.

---

#### Retry Policy

Retry cho:

- Network
- External API

Không retry:

- Validation
- Permission
- Business Rule

---

### 37. Documentation Standards

#### Document Governance

1. Architecture Working Group reviews both master documents quarterly.
2. Service-boundary, protocol, data-ownership or enterprise-technology changes require an ADR.
3. Implementation status must cite repository evidence and snapshot date.
4. Approved changes update Version, Last Updated and Change History.
5. OpenWiki is a source map; live source and approved architecture decisions take precedence.

#### Diagram Standards

Every architecture diagram must begin with exactly one caption inside its fenced block:

- `[Component Diagram]` — runtime/component topology and responsibility.
- `[Deployment Diagram]` — environments, containers and infrastructure placement.
- `[Sequence Diagram]` — ordered actor/service interactions.
- `[Data Flow Diagram]` — ingestion, retrieval, transformation and streaming pipelines.
- `[State Diagram]` — lifecycle states and allowed transitions.

Transport labels are canonical:

- `[Sync HTTPS]`
- `[Sync Internal HTTP]`
- `[Async Redis Streams]`
- `[Notification Redis Pub/Sub]`
- `[SSE]`

JSON, YAML, directory trees, UI wireframes and short notation examples are not architecture diagrams and do not require a diagram caption.

#### Documentation Levels

- README
- Architecture
- ADR
- API
- Runbook

---

#### ADR

Mọi quyết định lớn đều phải có ADR.

Ví dụ:

- chọn RAG
- chọn Shared State
- chọn SSE
- chọn Fixed-schema UI

---

#### API Documentation

Toàn bộ REST API phải được sinh từ OpenAPI Specification.

---

### 38. Quality Gates

#### Before Merge

- Lint
- Build
- Test
- Type Check
- Security Scan

---

#### Before Release

- Regression Test
- Load Test
- AI Evaluation
- RAG Evaluation
- Documentation Review

---

#### Definition of Done

Một tính năng chỉ được coi là hoàn thành khi:

- hoàn thành implementation;
- có test;
- có documentation;
- được review;
- monitoring hoạt động;
- không còn bug blocker.

---

#### Deliverables

- Engineering Handbook
- Coding Standards
- Git Workflow
- API Guidelines
- Documentation Standards
- Definition of Done

---

### 44. Risks & Mitigation

| Risk              | Impact | Mitigation                      |
| ----------------- | ------ | ------------------------------- |
| Hallucination     | High   | RAG + Evidence + HITL           |
| Prompt Injection  | High   | Prompt Firewall + Validation    |
| Vendor Lock-in    | Medium | Model Gateway + Adapter Pattern |
| Context Overflow  | Medium | Memory Summarization            |
| Retrieval Quality | High   | Hybrid Search + Re-ranking      |
| Streaming Failure | Medium | Event Retry + Resume            |
| Cost Growth       | Medium | Model Routing + Cache           |

---

### 45. Architecture Decision Records (ADR)

#### Purpose

Mọi quyết định kiến trúc quan trọng phải được ghi lại dưới dạng ADR để đảm bảo khả năng truy vết và hỗ trợ các thành viên mới hiểu được lý do đằng sau từng quyết định.

---

#### ADR Template

```text
ADR-XXX

Title

Status

Context

Decision

Alternatives

Consequences

References
```

---

#### Initial ADR List

**Implementation Status: Planned.** The ADR directory currently contains the template only; these identifiers are reserved handbook references until individual ADR files are approved.

- ADR-001: Adopt AI-native Architecture
- ADR-002: Use PostgreSQL as Business Source of Truth and Redis for Shared State
- ADR-003: Fixed-schema Generative UI
- ADR-004: Server-Sent Events for Streaming
- ADR-005: Retrieval-Augmented Generation
- ADR-006: Tool Registry & Tool Calling
- ADR-007: Human-in-the-loop Workflow
- ADR-008: Polyglot Persistence
- ADR-009: Monorepo Architecture
- ADR-010: Event-driven AI Runtime

---

### Appendix A. Architecture Decision Matrix & Technology Selection Record

---

### A.1 Purpose

Technology Selection Record (TSR) ghi lại lý do lựa chọn các công nghệ chính trong dự án. Không chỉ trả lời câu hỏi **"chúng ta đang dùng gì?"** mà còn trả lời **"tại sao lại chọn?"** và **"khi nào nên thay đổi?"**.

Mỗi quyết định công nghệ cần được đánh giá dựa trên:

- Business Fit
- Technical Fit
- Community
- Long-term Maintainability
- Vendor Lock-in
- Learning Curve
- Cost
- Scalability

---

#### Architecture Decision Matrix

| Problem | Selected solution | Alternatives | Decision rationale | Horizon | Implementation | ADR reference |
| --- | --- | --- | --- | --- | --- | --- |
| Browser application | React + TypeScript | Vue, Angular, Svelte | Typed component ecosystem and existing repository | Current Decision | Implemented | ADR-001 |
| Business/API platform | Express.js on Node.js | NestJS, Go/Gin, Spring Boot | Existing domain platform, TypeScript contracts, SSE and upload boundary | Current Decision | Implemented | ADR-001 |
| AI runtime | FastAPI on Python | Node AI runtime | Python AI ecosystem and isolated responsibility boundary | Current Decision | Implemented | ADR-001 |
| Workflow orchestration | LangGraph | OpenAI Agents SDK (Enterprise Vision), custom runtime | Durable graph state, interrupt/resume and explicit control flow | Current Decision | Implemented | ADR-010 |
| Business database | PostgreSQL | MySQL, document database | Transactions, relational domain model and operational maturity | Current Decision | Implemented | ADR-002 |
| Vector retrieval | pgvector | Qdrant, Milvus, Pinecone (Enterprise Vision) | One operational database and direct FastAPI knowledge retrieval | Current Decision | Partial | ADR-005 |
| Workflow event backbone | Redis Streams | Kafka, NATS (Enterprise Vision) | Existing Redis foundation, replay, consumer groups and lower operational cost | Current Decision | Implemented | ADR-010 |
| Notification fan-out | Redis Pub/Sub | Redis Streams, external broker | Low-latency non-durable fan-out after authoritative persistence | Current Decision | Partial | ADR-010 |
| Browser streaming | SSE through Express | WebSocket (Enterprise Vision only by ADR) | One-way server updates, simpler authorization and reconnect model | Current Decision | Partial | ADR-004 |
| Express ↔ FastAPI | Internal HTTP | gRPC | Approved simple service boundary and OpenAPI-compatible contracts | Current Decision | Planned; gRPC drift remains | ADR-001 |
| Workflow checkpoint | PostgreSQL LangGraph checkpointer | MemorySaver, Redis | Durable resume across process restart | Current Decision | Partial | ADR-007 |

The detailed records below provide supporting notes. Enterprise alternatives are not current dependencies and require a new ADR before adoption.

---

### A.2 Frontend

#### React

##### Selected

React 19

##### Reason

- Ecosystem lớn
- Component Architecture
- AG-UI compatible
- CopilotKit compatible
- Streaming-friendly
- Server Components (Planned Evolution)

##### Alternatives

- Vue
- Angular
- Svelte

##### Decision

React phù hợp nhất với hệ sinh thái AI hiện tại.

---

#### TypeScript

##### Reason

- Strong typing
- Shared contracts
- Better IDE
- Safer refactoring

Mandatory.

---

#### TailwindCSS

##### Reason

- Design consistency
- Fast iteration
- Low CSS maintenance

---

#### shadcn/ui

##### Reason

- Headless
- Accessible
- AI-friendly Components
- No Vendor Lock-in

---

#### TanStack Query

##### Reason

- Cache
- Mutation
- Server State
- Optimistic Update

---

#### AG-UI Protocol

##### Reason

Fixed-schema UI.

Không để AI sinh JSX.

---

### A.3 Backend

#### Node.js + Express.js

##### Reason

- Phù hợp với TypeScript monorepo
- Express sở hữu Authentication, Authorization và Business API
- Hỗ trợ SSE Gateway và Upload API
- Contract sharing với React

---

#### PostgreSQL

##### Reason

- ACID
- JSONB
- Mature ecosystem

---

#### Redis

##### Reason

- Cache
- Pub/Sub
- Session
- Streaming

---

#### pgvector

##### Current

PostgreSQL extension pgvector là vector database hiện tại.

##### Enterprise Vision Alternatives

Qdrant, Milvus hoặc Pinecone chỉ được đánh giá bằng ADR nếu pgvector không còn đáp ứng yêu cầu.

---

### A.4 AI Stack

#### Gemini

Current default model provider.

Reason

- Strong reasoning
- Tool Calling
- Structured Output

---

#### LangGraph

Selected current workflow engine.

Reason

- State Machine
- Graph Runtime
- Streaming

---

#### OpenAI Agents SDK (Enterprise Vision Alternative)

Enterprise Vision candidate only; không thay thế LangGraph trong current architecture.

Reason

- Native Agent Runtime
- Better Tooling
- Tracing

---

#### RAG

Chosen over Fine-tuning.

Reason

- Lower cost
- Easier updates
- Explainability

---

### A.5 Infrastructure

Docker

Mandatory

---

GitHub Actions

Current CI/CD

---

Cloud Run

Hackathon Deployment

---

Kubernetes — Enterprise Vision

---

### A.6 Architecture Decision Review

TSR cần được review:

- mỗi 6 tháng
- khi đổi major architecture
- khi thay AI framework

---

## Best Practices

Keep current decisions separate from Planned Evolution and Enterprise Vision material.

## Future Evolution

Future changes require the review and ADR controls described in the related documents.

## References

- [Legacy source](../../documents/TECHNICAL_MASTER_PLAN.md)

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

- [Technical Master Plan](./TECHNICAL_MASTER_PLAN.md)
- [Roadmap Master](../roadmap/ROADMAP_MASTER.md)
- [DevOps Master Plan](../platform/DEVOPS_MASTER_PLAN.md)
- [Glossary](../glossary/GLOSSARY.md)
