# Event Architecture

> Canonical handbook. The preserved source material remains under `documents/`.

## Purpose

Define the canonical asynchronous event backbone and browser streaming boundary.

## Scope

Redis Streams, Redis Pub/Sub, event envelopes, workflow coordination, SSE, reliability, and event schemas.

## Dependencies

Express filters browser events; FastAPI and workers publish through versioned contracts.

## Background

Background is provided by the linked master documentation.

## Architecture

### 17A. Event & Streaming Architecture

---

### Architecture Status

| Architecture Horizon | Implementation Status |
| --- | --- |
| Current Decision | Partial Redis Streams, Event Envelope and worker foundation |
| Planned Evolution | Complete Express SSE gateway, normalized Shared State events and Planner events |
| Enterprise Vision | Kafka/NATS or distributed event infrastructure only after ADR |

### Design Principles

- Durable workflow events use Redis Streams.
- Notification fan-out uses Redis Pub/Sub only after authoritative persistence.
- Browser streaming uses SSE through Express.
- Every event uses a versioned envelope and idempotent consumer policy.
- LangGraph owns workflow control flow; events carry lifecycle and work delivery.
- Event producers never bypass authorization boundaries for business actions.

### Overview

Event & Streaming Architecture là **xương sống của toàn bộ Servexa Warranty AI**, kết nối React, Express và FastAPI thành một hệ thống thống nhất theo mô hình Event-driven.

Khác với kiến trúc Request → Response truyền thống, Agent Runtime cần liên tục:

- stream kết quả từng bước;
- đồng bộ Shared State;
- điều phối nhiều workflow;
- tạm dừng (Interrupt);
- tiếp tục (Resume);
- gọi Tool đồng bộ và bất đồng bộ;
- cập nhật UI theo thời gian thực.

Event được dùng cho workflow lifecycle, streaming và bất đồng bộ. Request/response đồng bộ vẫn dùng HTTPS từ Frontend tới Express và Internal HTTP từ Express tới FastAPI.

---

### Design Goals

Kiến trúc Event & Streaming hướng tới các mục tiêu sau:

- Streaming-first.
- Event-driven.
- Decoupled Services.
- Observable.
- Recoverable.
- Scalable.
- Human-in-the-loop Ready.
- Enterprise Vision: Multi-Agent Ready; không phải capability hiện tại.

---

### High-level Communication Architecture

```text
[Component Diagram]
React Web
    │ [Sync HTTPS] / [SSE]
    ▼
Express Gateway / Business APIs / Streaming Gateway
    ├──────────────► PostgreSQL Business Data
    ├──────────────► Redis Shared State
    └── [Sync Internal HTTP] ──► FastAPI AI Runtime
                              ├──► pgvector Knowledge
                              ├──► PostgreSQL LangGraph Checkpointer
                              └──► [Async Redis Streams] Event Bus
                                         ├──► Workflow Coordinator
                                         └──► OCR Worker

Express Notification API ──► PostgreSQL ──► [Notification Redis Pub/Sub] ──► Subscribers
[Async Redis Streams] ──► Express Streaming Gateway ── [SSE] ──► React Web
```

---

### Runtime Responsibilities

#### React

Chịu trách nhiệm:

- Render UI
- Shared State Consumer
- SSE Client
- Event Processing
- User Interaction

Frontend không chứa Business Logic.

---

#### Express

Express là **Gateway + Business Service**.

Bao gồm:

- Authentication
- Authorization
- Business APIs
- CRUD APIs
- Workflow APIs
- SSE Gateway
- Upload APIs
- Notification API

Express không thực hiện AI Reasoning.

---

#### FastAPI

FastAPI là AI Runtime.

Bao gồm:

- LangGraph
- Planner
- RAG
- Context Builder
- Tool Calling
- Reasoning
- UI Generation

FastAPI không trực tiếp xử lý nghiệp vụ.

---

#### PostgreSQL

Được sử dụng cho:

- Business Data
- LangGraph Checkpoint
- Workflow Snapshot
- Audit Log

Checkpoint được lưu trong PostgreSQL để đảm bảo workflow có thể khôi phục sau khi hệ thống khởi động lại.

---

#### Redis

Redis đảm nhiệm nhiều vai trò:

- Shared State Store
- Cache
- Session
- RAG Cache
- Pub/Sub
- Redis Streams

Redis không phải nguồn dữ liệu nghiệp vụ chính.

---

#### pgvector

AI Runtime truy cập pgvector trực tiếp để:

- Retrieval
- Embedding Search
- Semantic Search
- Similarity Search

Không cần đi qua Express.

---

### Communication Principles

Mọi giao tiếp đều tuân theo nguyên tắc:

- Frontend chỉ giao tiếp với Express.
- FastAPI không bao giờ được Frontend gọi trực tiếp.
- Business Data luôn đi qua Express.
- AI Runtime chỉ đọc Knowledge trực tiếp.
- Shared State luôn đi qua Redis.
- Event là ngôn ngữ chung giữa các Runtime.

---

### Event Lifecycle

Một workflow tiêu chuẩn sẽ diễn ra như sau:

```text
[Sequence Diagram]
Edges: [Sync HTTPS] · [Sync Internal HTTP] · [Async Redis Streams] · [SSE]
User Message

↓

Express

↓

FastAPI

↓

Planner

↓

Retrieval

↓

Tool Execution

↓

Express Business API (Internal HTTP)

↓

Reasoning

↓

UI Generation

↓

State Patch Proposal

↓

Express State Policy / Redis Shared State Write

↓

Redis Streams

↓

Express SSE Gateway

↓

Frontend

↓

User
```

---

### Event Envelope Specification

Mọi Event trong hệ thống đều sử dụng cùng một chuẩn.

```json
{
  "version": "1.0",
  "id": "evt_xxx",
  "type": "workflow.progress",
  "workflowId": "...",
  "conversationId": "...",
  "timestamp": "...",
  "payload": {}
}
```

---

#### Required Fields

| Field          | Description             |
| -------------- | ----------------------- |
| version        | Event version           |
| id             | Event ID                |
| type           | Event Type              |
| workflowId     | Workflow Identifier     |
| conversationId | Conversation Identifier |
| timestamp      | Event Timestamp         |
| payload        | Versioned Event Payload |

---

### Event Bus

Redis Streams là Event Bus chính.

Vai trò:

- Event Queue
- Workflow Queue
- Retry
- Replay
- Ordering

Không dùng Redis Pub/Sub cho Workflow.

Redis Pub/Sub chỉ dùng cho notification fan-out không cần replay; notification có yêu cầu bền vững phải được ghi PostgreSQL trước khi publish.

---

#### Event Flow

```text
[Data Flow Diagram]
Execution Plan

↓

FastAPI Tool Executor

↓

Express Authorization / Job API

↓

[Async Redis Streams]

↓

Consumers

↓

Workflow Coordinator

↓

Workers
```

---

### Workflow Coordinator

Workflow Coordinator là thành phần điều phối toàn bộ Event bất đồng bộ.

Coordinator là infrastructure worker cho Redis Streams, không phải workflow engine thay thế LangGraph. Khi cần resume AI workflow, Coordinator gọi FastAPI qua Internal HTTP; Express vẫn sở hữu public Workflow API và authorization.

Nhiệm vụ:

- Subscribe Redis Streams.
- Quản lý trạng thái Workflow.
- Điều phối Worker.
- Retry Event.
- Timeout.
- Dead-letter Queue.
- Resume Workflow.

Planner không cần biết Worker nào đang chạy.

Điều này giúp giảm coupling giữa LangGraph và hạ tầng thực thi.

---

### Streaming Gateway

Express đóng vai trò **SSE Gateway**.

Frontend chỉ duy trì **một kết nối SSE duy nhất**.

Express chịu trách nhiệm:

- Authentication.
- Authorization.
- Merge nhiều Event Stream.
- Filter Event.
- Forward Event.

---

#### Streaming Flow

```text
[Sequence Diagram]
FastAPI

↓

[Async Redis Streams]

↓

Express

↓

[SSE]

↓

Frontend
```

---

### Shared State Synchronization

Shared State được lưu trong Redis.

Không Runtime nào được coi local copy là business source of truth; React và FastAPI chỉ giữ projection/working context theo contract.

```text
[Data Flow Diagram]
Edge: [SSE]
Redis

↓

Express reads authorized projection

↓

SSE state.patch

↓

Frontend

↓

Render
```

---

#### Patch Strategy

Chỉ truyền phần thay đổi.

Ví dụ:

```json
{
  "op": "replace",
  "path": "/workflow/status",
  "value": "waiting_approval"
}
```

Không truyền toàn bộ State.

---

### LangGraph Integration

LangGraph sử dụng:

- PostgreSQL Checkpointer
- Redis Shared State
- Redis Streams
- HTTP Tool Calling

Planner chỉ điều phối Workflow.

Không chịu trách nhiệm quản lý Event.

---

### Hybrid Tool Execution

Tool được chia thành hai nhóm.

---

#### Sync Tool

Ví dụ:

- Get Warranty
- Get Customer
- Query Product

```text
[Sequence Diagram]
Execution Plan

↓

FastAPI Tool Executor

↓

 [Sync Internal HTTP]

↓

Express Authorization + Business API

↓

Response
```

---

#### Async Tool

Ví dụ:

- OCR
- Vision
- Import
- Export

```text
[Sequence Diagram]
Execution Plan

↓

[Async Redis Streams]

↓

Worker

↓

Event

↓

Workflow Coordinator

↓ Internal HTTP

FastAPI / LangGraph Resume
```

Email/notification được tạo qua Express Notification API, ghi trạng thái nghiệp vụ cần thiết vào PostgreSQL, rồi fan-out bằng Redis Pub/Sub. Redis Streams chỉ dùng nếu notification là một workflow job cần retry/replay.

---

### Interrupt & Resume

Workflow có thể tạm dừng.

Ví dụ:

```text
[State Diagram]
Recommendation

↓

Approval Required

↓

Checkpoint

↓

PostgreSQL LangGraph Checkpointer

↓

Waiting Human

↓

Resume

↓

Continue
```

Planner không mất Context.

---

### Event Catalog

Các Event chuẩn hóa bao gồm:

##### Conversation Events

- conversation.started
- conversation.updated
- conversation.completed

---

##### Workflow Events

- workflow.started
- workflow.progress
- workflow.interrupted
- workflow.resumed
- workflow.completed
- reasoning.started
- reasoning.updated
- reasoning.completed

Reasoning lifecycle remains grouped with the workflow that owns it.

---

##### Planner Events — Planned Evolution

- planner.plan.created
- planner.plan.updated
- planner.plan.failed

Planner events are Planned Evolution and are not part of the current implemented event contract.

---

##### Retrieval Events

- retrieval.started
- retrieval.completed
- retrieval.failed

---

##### Tool Events

- tool.started
- tool.completed
- tool.failed

---

##### Evidence Events

- evidence.created
- evidence.updated

---

##### UI Events

- ui.generated
- ui.updated

---

##### Approval Events

- approval.requested
- approval.completed
- approval.rejected

---

##### Shared State Events

- state.patch
- state.synced

---

##### System Events

- notification.created
- error
- done

---

### Lifecycle State Machines

#### Conversation State

```text
[State Diagram]

started → active → completed
             └──→ failed
```

#### Workflow State

```text
[State Diagram]

idle → running → waiting_approval → running (resumed) → completed
          └──────────────────────────────────────────────→ failed
```

`resumed` is a transition event; the active state returns to `running`.

#### Approval / HITL State

```text
[State Diagram]

pending ──→ approved ──→ executed
   │           └───────→ failed
   ├────→ edited ──────→ executed
   │           └───────→ failed
   ├────→ rejected
   └────→ expired
```

These states match the existing HITL contract; invalid transitions are rejected by Express.

---

### Reliability

Hệ thống đảm bảo:

- Ordered Events.
- Retry.
- Resume.
- Deduplication.
- Dead-letter Queue.

---

### Failure Recovery

Nếu Worker lỗi:

```text
[Data Flow Diagram]
Event

↓

Retry

↓

Failure

↓

DLQ

↓

Alert
```

Workflow vẫn giữ nguyên Snapshot.

---

### Observability

Mỗi Event đều được theo dõi.

Bao gồm:

- workflow_id
- event_id
- latency
- producer
- consumer
- retry_count
- status

Toàn bộ Event có thể truy vết từ Frontend đến AI Runtime.

---

### Security

Streaming phải đảm bảo:

- JWT Validation.
- RBAC.
- Conversation Ownership.
- Workflow Permission.
- Event Filtering.

Frontend chỉ nhận Event thuộc phiên làm việc của mình.

---

### Scalability

Kiến trúc hiện tại triển khai **một FastAPI AI Runtime** để tối ưu chi phí và đơn giản hóa vận hành.

Tuy nhiên, AI Runtime được thiết kế gần như stateless (ngoại trừ LangGraph Checkpoint trong PostgreSQL và Shared State trong Redis), cho phép mở rộng theo chiều ngang khi cần mà không phải thay đổi giao thức giao tiếp.

Kiến trúc tương lai:

```text
[Component Diagram]
Edges: [Sync HTTPS] · [Sync Internal HTTP]
                         React
                     │
                   Express
                     │
             Internal HTTP
                     │
              Load Balancer
        ┌────────┬────────┬────────┐
        ▼        ▼        ▼
   FastAPI-1 FastAPI-2 FastAPI-3
             │
      PostgreSQL + Redis
```

---

### Enterprise Vision — Future Evolution

**Enterprise Vision:** kiến trúc Event & Streaming có thể được mở rộng cho:

- Multi-Agent Runtime.
- Distributed LangGraph.
- MCP Tool Runtime.
- Kafka / NATS Event Bus.
- WebSocket Gateway.
- Workflow Engine.
- Cross-service Event Sourcing.
- Enterprise Message Broker.

---

### Deliverables

- Event Communication Protocol
- Versioned Event Envelope
- Redis Streams Architecture
- Workflow Coordinator
- SSE Gateway
- Shared State Synchronization
- LangGraph Streaming Integration
- Hybrid Tool Execution Model
- Interrupt & Resume Protocol
- Event Catalog
- Reliability & Recovery Strategy
- Observability & Tracing
- Horizontal Scaling Strategy

### 80. Streaming

Streaming uses Server-Sent Events (SSE).

Streaming pipeline:

FastAPI

↓

Redis Streams

↓

Express

↓

SSE

↓

React

Streaming delivers:

* AI Tokens
* Workflow Progress
* State Updates
* Evidence
* Suggested Actions
* UI Updates

---

### B.6 Streaming Workflow

```text
[Sequence Diagram]
Edges: [Async Redis Streams] · [SSE]
Prompt

↓

Planner

↓

Retrieval

↓

Evidence Stream

↓

Tool Stream

↓

Reasoning

↓

UI Schema

↓

Redis Streams

↓

Express SSE Gateway

↓

Frontend
```

---

### C.7 Event Schema

```yaml
version:

id:

type:

workflowId:

conversationId:

timestamp:

payload:
```

---

### C.8 Streaming Event Types

```text
conversation.started
conversation.updated
conversation.completed
workflow.started
workflow.progress
workflow.interrupted
workflow.resumed
workflow.completed
retrieval.started
retrieval.completed
retrieval.failed
tool.started
tool.completed
tool.failed
evidence.created
evidence.updated
reasoning.started
reasoning.updated
reasoning.completed
ui.generated
ui.updated
state.patch
state.synced
approval.requested
approval.completed
approval.rejected
notification.created
error
done
```

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

- [ADR-004: Server-Sent Events streaming](../adr/ADR-004-server-sent-events-streaming.md)
- [ADR-010: Event-driven AI runtime](../adr/ADR-010-event-driven-ai-runtime.md)

## Related Documents

- [Technical Master Plan](./TECHNICAL_MASTER_PLAN.md)
- [Roadmap Master](../roadmap/ROADMAP_MASTER.md)
- [DevOps Master Plan](../platform/DEVOPS_MASTER_PLAN.md)
- [Glossary](../glossary/GLOSSARY.md)
