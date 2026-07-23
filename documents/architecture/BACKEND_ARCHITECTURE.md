# Backend Architecture

> Canonical handbook. The preserved source material remains under `documents/`.

## Purpose

Define the Express business platform, API boundary, and authoritative persistence responsibilities.

## Scope

Backend services, database design, REST APIs, PostgreSQL, and pgvector.

## Dependencies

Event delivery and AI orchestration use the event and AI runtime contracts.

## Background

Background is provided by the linked master documentation.

## Architecture

### Part III. Backend Architecture

---

### 15. Backend Services

#### Architecture Status

| Architecture Horizon | Implementation Status | Note |
| --- | --- | --- |
| Current Decision | Partial | Express/FastAPI ownership is approved; remaining gRPC paths are implementation drift pending Internal HTTP migration. |

#### Overview

Backend của Servexa Warranty AI được thiết kế theo hướng **AI-native Service Architecture**, trong đó AI Runtime và Business Services được tách biệt hoàn toàn.

Business Service không biết AI tồn tại.

AI Runtime không trực tiếp thao tác **business tables**. FastAPI được phép đọc knowledge embeddings trực tiếp từ pgvector và dùng PostgreSQL LangGraph checkpointer.

Toàn bộ giao tiếp đều thông qua API Contract rõ ràng.

Điều này giúp:

- dễ mở rộng;
- dễ kiểm thử;
- dễ thay đổi AI Framework;
- giảm coupling.

---

#### Backend Architecture

```text
[Component Diagram]
                        Frontend
                    │
                    ▼
       Express Gateway / Business API
          │             │          │
          │             ▼          ▼
          │       PostgreSQL     Redis
          │       Business Data  Shared State
          ▼
 [Sync Internal HTTP]
          │
          ▼
 FastAPI AI Runtime
    │             │
    ▼             ▼
 pgvector    PostgreSQL Checkpointer
```

---

#### Service Responsibilities

##### API Gateway

Là entry point duy nhất của hệ thống.

Chịu trách nhiệm:

- Authentication
- Authorization
- Rate Limiting
- Request Routing
- Logging
- SSE Gateway

Gateway không chứa Business Logic.

---

##### AI Runtime Service

Đây là service trung tâm của Agent.

Bao gồm:

- Planner
- Context Builder
- Tool Executor
- Memory
- RAG
- UI Generator
- Streaming Engine

AI Runtime sở hữu AI orchestration, planning, RAG, context building, reasoning và UI generation.

Không thao tác business tables trực tiếp; chỉ đọc pgvector cho knowledge retrieval và dùng PostgreSQL LangGraph checkpointer.

---

##### Warranty Service

Quản lý:

- Warranty Case
- Warranty Policy
- Eligibility
- Approval

Đây là Domain Service quan trọng nhất.

---

##### Product Service

Quản lý:

- Product
- Model
- SKU
- Serial Number
- Category
- Brand

---

##### Repair Service

Quản lý:

- Repair Order
- Repair Timeline
- Technician
- Repair Result

---

##### Inventory Service

Quản lý:

- Spare Parts
- Stock
- Warehouse
- Reservation

---

##### Document Service

Quản lý:

- Upload
- Upload validation và object storage
- Metadata
- Version
- Storage

OCR, parsing, chunking và embedding thuộc FastAPI AI Runtime sau khi Express đã tiếp nhận an toàn file.

---

##### Knowledge Service

Express quản lý API quản trị/ingestion metadata; FastAPI quản lý:

- Embedding
- Retrieval
- Indexing
- Knowledge Version

---

##### Notification Service

Quản lý:

- Email
- Push
- Internal Notification

---

##### Audit Service

Lưu:

- Approval
- Tool Call
- Workflow
- Security Event

---

#### Service Communication

Service giao tiếp thông qua:

- Internal HTTP giữa Express và FastAPI
- Redis Streams cho event bus/workflow
- Redis Pub/Sub cho notification
- SSE từ Express tới Frontend

Repository hiện còn legacy gRPC contracts/paths trong `packages/proto`; đây là implementation drift cần migrate sang Internal HTTP, không phải current target architecture.

Enterprise Vision alternatives, chỉ được đánh giá lại bằng ADR và không thuộc target migration hiện tại:

- gRPC
- Message Queue

---

#### Domain-driven Design

Backend được chia theo Business Domain.

Ví dụ:

```text
modules/

    warranty/

    repair/

    inventory/

    customer/

    document/

    ai/
```

Không tổ chức theo Controller hoặc Repository.

---

#### Dependency Rule

```text
[Component Diagram]
Presentation

↓

Application

↓

Domain

↓

Infrastructure
```

Infrastructure không được gọi ngược Domain.

---

#### Deliverables

- API Gateway
- AI Runtime
- Warranty Service
- Repair Service
- Inventory Service
- Document Service
- Notification Service
- Audit Service

---

### 16. Database Design

#### Architecture Status

| Architecture Horizon | Implementation Status | Note |
| --- | --- | --- |
| Current Decision | Partial | PostgreSQL, pgvector and Redis roles are approved; some ownership and synchronization contracts remain incomplete. |

#### Overview

Kiến trúc lưu trữ sử dụng mô hình **Polyglot Persistence**, trong đó mỗi loại dữ liệu được lưu trữ trên nền tảng phù hợp với đặc tính của nó.

Điều này giúp tối ưu hiệu năng, khả năng mở rộng và giảm chi phí vận hành.

---

#### Storage Overview

```text
[Component Diagram]
Edge: [Sync Internal HTTP]
        Express                       FastAPI
           │                         │      │
           ▼                         ▼      ▼
 PostgreSQL Business Data       pgvector  PostgreSQL
           │                    Knowledge Checkpointer
           ▼
         Redis
 Cache / Shared State / Streams / Pub/Sub

 Object Storage ← Express Upload API
```

---

#### PostgreSQL

Lưu dữ liệu nghiệp vụ.

Ví dụ:

- User
- Product
- Warranty
- Repair
- Approval
- Conversation Metadata
- Audit
- LangGraph Checkpoint
- Embedding và Chunk qua extension pgvector

---

#### Redis

Redis dùng cho:

- Cache
- Session
- Redis Streams Event Bus
- Redis Pub/Sub Notification
- Shared State
- Rate Limit
- Lock

Redis không phải nguồn dữ liệu chính.

---

#### pgvector

Extension pgvector trong PostgreSQL lưu:

- Embedding
- Chunk
- Metadata

Hỗ trợ:

- Similarity Search
- Semantic Search

---

#### Object Storage

Lưu:

- Images
- PDF
- Invoice
- Warranty Card
- Repair Report

Metadata nằm trong PostgreSQL.

---

#### Database Relationships

```text
[Data Flow Diagram]
Customer

↓

Warranty Case

↓

Repair Order

↓

Repair Timeline

↓

Approval
```

---

#### Transaction Strategy

Business Transaction:

- PostgreSQL

AI Transaction:

- Event Driven

Không mở Transaction xuyên nhiều Service.

---

#### Indexing Strategy

PostgreSQL:

- Primary Key
- Foreign Key
- Composite Index
- Full Text Search

pgvector:

- HNSW
- IVF (Planned Evolution)

---

#### Backup Strategy

Bao gồm:

- Daily Backup
- PITR
- Snapshot
- Object Storage Replication

---

#### Deliverables

- PostgreSQL Schema
- Redis Design
- Vector Schema
- Object Storage Strategy
- Backup Policy

---

### 17. API Design

#### Architecture Status

| Architecture Horizon | Implementation Status | Note |
| --- | --- | --- |
| Current Decision | Partial | Versioned Express APIs are established; full Internal HTTP and SSE Gateway alignment is still Planned Evolution. |

#### Overview

API được thiết kế theo hướng **API-first**.

React, Express và FastAPI cùng sử dụng một bộ Contract thống nhất.

Mọi thay đổi đều bắt đầu từ Contract.

---

#### API Categories

##### REST API

Dành cho:

- CRUD
- Business Data
- Configuration

---

##### Streaming API

Dành cho:

- Chat
- Agent Workflow
- Progress
- UI Streaming

---

##### Internal API

Dành cho:

- Tool Calling
- AI Runtime
- Knowledge

---

##### Enterprise Vision — Future API

- MCP (Enterprise Vision)
- GraphQL
- Webhook

---

#### REST Design

REST sử dụng:

```text
GET

POST

PATCH

DELETE
```

Không dùng RPC Style.

---

#### Versioning

Ví dụ:

```text
/api/v1/

/api/v2/
```

Breaking Change tạo Version mới.

---

#### SSE Architecture

```text
[Sequence Diagram]
Edges: [Async Redis Streams] · [SSE]
Client

↓

HTTPS request

↓

Express Gateway

↓ Internal HTTP

FastAPI AI Runtime

↓ Redis Streams

Express SSE Gateway

↓ SSE

Events

↓

Client
```

Streaming Event:

- conversation.updated
- tool.started / tool.completed / tool.failed
- reasoning.updated
- ui.generated / ui.updated
- workflow.progress
- error / done

---

#### Standard Response

```json
{
  "success": true,
  "data": {},
  "metadata": {}
}
```

Error:

```json
{
  "error": {
    "code": "",
    "message": ""
  }
}
```

---

#### API Principles

- Stateless
- Idempotent
- Versioned
- Observable
- Documented

---

#### OpenAPI

Toàn bộ REST API cần:

- OpenAPI
- Swagger
- Generated SDK

---

#### Deliverables

- REST API
- SSE API
- API Contract
- OpenAPI
- SDK Generation

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

## Related ADRs

- [ADR-001: AI-native architecture](../adr/ADR-001-ai-native-architecture.md)
- [ADR-002: PostgreSQL and Redis state ownership](../adr/ADR-002-postgresql-and-redis-state-ownership.md)
- [ADR-008: Polyglot persistence](../adr/ADR-008-polyglot-persistence.md)
- [ADR-005: Retrieval-Augmented Generation](../adr/ADR-005-retrieval-augmented-generation.md)

## Related Documents

- [Technical Master Plan](./TECHNICAL_MASTER_PLAN.md)
- [Roadmap Master](../roadmap/ROADMAP_MASTER.md)
- [DevOps Master Plan](../platform/DEVOPS_MASTER_PLAN.md)
- [Glossary](../glossary/GLOSSARY.md)
