# System Overview

> Canonical handbook. The preserved source material remains under `documents/`.

## Purpose

Define the canonical system boundaries, service responsibilities, and ownership model.

## Scope

Runtime surfaces, communication boundaries, data ownership, and high-level topology.

## Dependencies

Detailed behavior belongs to the backend, frontend, AI, event, and platform handbooks.

## Background

Background is provided by the linked master documentation.

## Architecture

### 2. System Overview

#### Architecture Status

| Architecture Horizon | Implementation Status | Summary |
| --- | --- | --- |
| Current Decision | Partial | React → Express → FastAPI; PostgreSQL/pgvector; Redis; LangGraph; SSE |
| Planned Evolution | Planned | Complete Internal HTTP migration, full Express SSE gateway, Shared State Adapter, Tool Resolver/Adapter |
| Enterprise Vision | Not Applicable | Multi-Agent, distributed runtime, Kubernetes, Kafka/NATS, MCP, and alternative agent runtimes are not current architecture |

#### Current System Constraints

- One FastAPI AI Runtime deployment unit.
- One logical PostgreSQL instance, including pgvector and the LangGraph checkpointer.
- One logical Redis instance for cache, Shared State, Redis Streams, and Redis Pub/Sub.
- React communicates only with Express.
- Express communicates with FastAPI through the approved Internal HTTP boundary.
- Server-Sent Events are the only approved browser streaming protocol.
- Redis Streams are the durable event backbone; Redis Pub/Sub is notification fan-out only.
- LangGraph is the selected workflow engine.
- No distributed AI Runtime and no Multi-Agent architecture.

#### Implementation Status Snapshot

| Capability | Architecture Horizon | Implementation Status | Repository reality |
| --- | --- | --- | --- |
| React + Express + FastAPI service topology | Current Decision | Implemented | All three runtime surfaces exist |
| Express ↔ FastAPI Internal HTTP | Current Decision | Planned | Active gRPC paths remain migration debt |
| LangGraph and HITL | Current Decision | Implemented | Coordinator, checkpoint metadata, approval persistence, and resume flow exist |
| Redis Streams | Current Decision | Implemented | Producers, consumers, retry, and DLQ foundations exist |
| Express SSE Gateway | Current Decision | Partial | Streaming contracts exist; the complete target gateway remains incomplete |
| Redis Shared State | Current Decision | Partial | Operational context and state projections exist; normalized adapter/patch flow remains incomplete |
| RAG and pgvector | Current Decision | Partial | Retrieval exists; ingestion and governance are not production-complete |
| Observability | Current Decision | Partial | Logging and tracing foundations exist; production coverage is incomplete |

#### Platform Responsibility Matrix

| Surface | Owns | Must not own |
| --- | --- | --- |
| React | Rendering, local projection, SSE client, event processing, user interaction | Authentication decisions, business rules, AI orchestration, Redis access |
| Express | API Gateway, Business Platform, Workflow Gateway, Streaming Gateway, authentication, authorization, CRUD, uploads, business APIs | Planning, RAG reasoning, UI generation |
| FastAPI | LangGraph, Planner, Context Builder, Retriever, Reasoner, Tool Executor, UI Generator, Event Producer | Business transactions, authorization authority, direct browser communication |

#### Data Ownership Matrix

| Data domain | Authoritative owner | Storage | React access | FastAPI access |
| --- | --- | --- | --- | --- |
| Identity, customer, product, warranty, repair, inventory | Express | PostgreSQL | Express API | Express Business API |
| Conversation messages | Express | PostgreSQL | Express API/SSE | Context supplied by Express |
| Shared State coordination | Express boundary; Shared State Adapter is planned | Redis | Authorized projection through Express | Adapter/service policy |
| LangGraph checkpoints | FastAPI/LangGraph | PostgreSQL | None | PostgreSQL checkpointer |
| Knowledge documents and metadata | Express ingestion/admin boundary | Object Storage + PostgreSQL | Express API | Authorized references |
| Knowledge chunks and embeddings | FastAPI retrieval pipeline | PostgreSQL + pgvector | Evidence through Express/SSE | Direct pgvector read |
| Workflow events | Workflow Coordinator infrastructure | Redis Streams | Express SSE projection | Producer/consumer contracts |
| Notifications | Express | PostgreSQL record + Redis Pub/Sub fan-out | Express API/SSE | Tool result only |
| Audit logs | Express for business actions; FastAPI for AI trace input | PostgreSQL | Authorized audit API | Append through approved contract |

#### Communication Mode Matrix

| Mode | Transport | Use cases | Boundary |
| --- | --- | --- | --- |
| Synchronous | HTTPS / Internal HTTP | Authentication, authorization, customer/product/warranty lookup, business tools, Express ↔ FastAPI calls | Request receives a bounded response |
| Asynchronous | Redis Streams | OCR, vision, imports, long-running AI jobs, durable notification jobs | Versioned envelope, retry, idempotency, DLQ |
| Notification | Redis Pub/Sub | Non-durable fan-out after authoritative persistence | Never used as workflow storage |
| Streaming | SSE | Redis Streams → Express Streaming Gateway → React | One-way browser delivery; no WebSocket |

#### High-level Architecture

Kiến trúc tổng thể được chia thành các lớp có ranh giới trách nhiệm rõ ràng.

```text
[Component Diagram]
                User
Cross-service edges: [Sync HTTPS] · [Sync Internal HTTP] · [SSE]
                  │
                  ▼
        React Frontend
                  │
          [Sync HTTPS] / [SSE]
                  │
                  ▼
       Express Gateway / Business API
          │                   │
 [Sync Internal HTTP]        │
          │                   ▼
          ▼             PostgreSQL
 FastAPI AI Runtime
 (LangGraph / Planner / RAG / Tools / UI)
          │
   ┌──────┼──────────────┐
   ▼      ▼              ▼
pgvector Redis     PostgreSQL Checkpointer
```

---

#### Layer Responsibilities

##### Presentation Layer

Bao gồm:

- React
- Copilot Panel
- AI Components
- SSE Client và Event Processor
- Local Shared State Projection

Chịu trách nhiệm hiển thị trải nghiệm AI và gửi tương tác người dùng qua Express. Presentation Layer không điều phối AI và không chứa business logic.

---

##### AI Runtime Layer

Là trái tim của hệ thống.

Bao gồm:

- Planner
- Context Builder
- Tool Executor
- Memory
- Reasoning
- UI Generator

---

##### Knowledge Layer

Bao gồm:

- Embedding
- Retrieval
- Reranking
- Citation
- Metadata

---

##### Business Layer

Bao gồm:

- Warranty
- Product
- Inventory
- User
- Technician
- Approval

Business Layer không biết LLM tồn tại.

---

##### Infrastructure Layer

Bao gồm:

- PostgreSQL
- Redis
- pgvector
- Object Storage
- Logging
- Monitoring

---

#### Runtime Flow

Một yêu cầu điển hình sẽ trải qua các bước:

1. User gửi yêu cầu.
2. Frontend gửi request tới Express Gateway.
3. Express xác thực, phân quyền và cập nhật business data hoặc Shared State khi cần.
4. Express gọi FastAPI AI Runtime qua Internal HTTP.
5. Context Builder dựng ngữ cảnh; dữ liệu nghiệp vụ được lấy qua Express API.
6. Planner tạo kế hoạch trong LangGraph.
7. Tool được gọi qua Express API nếu cần thao tác nghiệp vụ.
8. RAG đọc knowledge embeddings trực tiếp từ pgvector.
9. Reasoning tổng hợp và Generative UI sinh fixed-schema payload.
10. Workflow event được ghi vào Redis Streams; notification dùng Redis Pub/Sub.
11. Express Streaming Gateway chuyển event đã được phân quyền tới Frontend bằng SSE.
12. Frontend xử lý event, cập nhật local projection và render.

---

#### Technology Stack

##### Frontend

- React
- TypeScript
- TanStack Query
- Tailwind CSS
- Shadcn UI
- AG-UI (Generative UI)

---

##### Backend

- Node.js
- Express.js
- REST API
- Internal HTTP tới FastAPI
- SSE Streaming Gateway
- PostgreSQL
- Redis Streams / Redis Pub/Sub

---

##### AI

- Python
- FastAPI
- LangGraph
- LangChain
- OpenAI Compatible Models
- Embedding Models

---

##### Storage

- PostgreSQL + pgvector
- Redis (Cache / Shared State / Streams / Pub/Sub)
- Object Storage

---

##### Infrastructure

- Docker
- Docker Compose
- Kubernetes (Enterprise Vision; not a current dependency)
- GitHub Actions

---

#### Repository Structure

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

## Design Principles

Apply the approved boundaries, ownership rules, and status classifications preserved in this handbook.

## Implementation

Implementation details remain governed by the architecture and contracts referenced above.

## Best Practices

Keep current decisions separate from Planned Evolution and Enterprise Vision material.

## Future Evolution

### 42. Enterprise Vision — Enterprise Integration

Mọi enterprise connector thuộc Express Business/Integration Layer. FastAPI chỉ truy cập chúng qua Tool contract và Internal HTTP; không kết nối ERP, CRM hoặc identity provider trực tiếp.

#### ERP

- SAP
- Oracle
- Microsoft Dynamics

---

#### CRM

- Salesforce
- HubSpot

---

#### Collaboration

- Microsoft Teams
- Slack
- Google Workspace

---

#### Identity

- OAuth2
- SAML
- OpenID Connect

---

## References

- [Legacy source](../../documents/TECHNICAL_MASTER_PLAN.md)

## Related ADRs

- [ADR-001: AI-native architecture](../adr/ADR-001-ai-native-architecture.md)
- [ADR-008: Polyglot persistence](../adr/ADR-008-polyglot-persistence.md)
- [ADR-009: Monorepo architecture](../adr/ADR-009-monorepo-architecture.md)

## Related Documents

- [Technical Master Plan](./TECHNICAL_MASTER_PLAN.md)
- [Roadmap Master](../roadmap/ROADMAP_MASTER.md)
- [DevOps Master Plan](../platform/DEVOPS_MASTER_PLAN.md)
- [Glossary](../glossary/GLOSSARY.md)
