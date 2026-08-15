# Shared State

> Canonical handbook. The preserved source material remains under `documents/`.

## Purpose

Define state ownership, synchronization, checkpoints, and projection boundaries.

## Scope

PostgreSQL authority, Redis coordination state, state patches, synchronization, and schemas.

## Dependencies

State changes cross service boundaries through validated APIs and event contracts.

## Background

Background is provided by the linked master documentation.

## Architecture

### Part II-B. Shared State & Conversation Memory

---

### 8. Shared State Architecture

#### Architecture Status

| Architecture Horizon | Implementation Status |
| --- | --- |
| Current Decision | Partial Redis coordination state |
| Planned Evolution | Shared State Adapter and normalized patch/merge validation |
| Enterprise Vision | Cross-device, collaborative and distributed state |

#### Design Principles

- PostgreSQL remains the business source of truth.
- Redis stores coordination state, not authoritative business records.
- React consumes only an authorized local projection.
- State changes are versioned patches.
- Express controls boundary validation and business persistence.

#### Shared State Adapter — Planned Evolution

Components must not depend on Redis commands directly after adapter migration. The planned Shared State Adapter has exactly five responsibilities:

1. **Read** — obtain a scoped state projection.
2. **Write** — store a complete validated coordination state.
3. **Patch** — apply a versioned partial change.
4. **Merge** — combine non-conflicting updates using source precedence.
5. **Validate** — reject unsupported schema versions and invalid domain paths.

Current direct Redis access is implementation drift. The adapter is documentation-level planned architecture and does not change current runtime contracts.

#### Overview

Shared State là một trong những quyết định kiến trúc quan trọng nhất của Servexa Warranty AI. Thay vì coi AI là một dịch vụ bên ngoài chỉ nhận Prompt và trả về Response, hệ thống được thiết kế để AI trở thành một thành phần cùng tham gia vào Business Workflow.

Mọi thành phần trong hệ thống làm việc với cùng một **Business Context contract**, nhưng chỉ truy cập qua ranh giới được phép. Redis lưu Shared State điều phối; Express tạo projection đã được phân quyền cho Frontend và FastAPI. PostgreSQL do Express quản lý vẫn là nguồn dữ liệu nghiệp vụ có thẩm quyền.

Kiến trúc này giúp Agent luôn hiểu được trạng thái hiện tại của hồ sơ bảo hành, hành động đã thực hiện, dữ liệu đang hiển thị trên giao diện và các quyết định đang chờ xử lý.

---

#### Design Goals

Shared State được xây dựng nhằm đạt được các mục tiêu:

- Xây dựng một nguồn trạng thái điều phối thống nhất trong Redis; không thay thế PostgreSQL làm business source of truth.
- Đồng bộ projection giữa Frontend, Express và AI Runtime qua API/event contract.
- Giảm số lượng Prompt chứa dữ liệu lặp lại.
- Hỗ trợ nhiều workflow chạy đồng thời.
- Chuẩn bị nền tảng cho Human-in-the-loop.
- Chuẩn bị nền tảng cho Generative UI.
- Enterprise Vision: hỗ trợ Multi-Agent trong tương lai; không phải capability hiện tại.

---

#### Architecture Overview

```text
[Component Diagram]
                User
Cross-service edges: [Sync HTTPS] · [Sync Internal HTTP] · [SSE]
                  │
                  ▼
            React Frontend
                  │
          HTTPS / SSE
                  │
                  ▼
        Express Gateway / API
          │               │
          ▼               ▼
 Redis Shared State   PostgreSQL
          │        (business source of truth)
          ▼
 Internal HTTP Context
          │
          ▼
   FastAPI AI Runtime
```

Shared State là contract dùng chung được lưu trong Redis và được Express kiểm soát tại ranh giới truy cập. Frontend chỉ giữ local projection nhận qua API/SSE; FastAPI nhận context qua Express/Internal HTTP hoặc truy cập Redis theo service policy, không biến Shared State thành business database.

---

#### Core Concepts

##### Business Context

Business Context đại diện cho projection cần thiết của một workflow.

Ví dụ:

- Warranty Case
- Customer
- Product
- Repair Status
- Evidence
- Suggested Actions
- Pending Approval
- Technician Assignment
- Inventory Status

Agent không phải tự suy luận các thông tin này từ hội thoại. Context Builder nhận projection phù hợp; khi cần business data mới nhất, FastAPI gọi Express Business API.

---

##### UI Context

UI Context phản ánh trạng thái của giao diện.

Ví dụ:

- Tab đang mở
- Panel đang hiển thị
- Component được chọn
- Filter hiện tại
- Scroll Position (nếu cần)

Điều này cho phép AI hiểu người dùng đang thao tác ở đâu mà không cần người dùng mô tả lại.

---

##### Agent Context

Agent Context bao gồm:

- Conversation
- Memory
- Current Goal
- Active Workflow
- Tool Results
- Planner State

Đây là trạng thái nội bộ của Agent nhưng vẫn được đồng bộ với Business Context.

---

#### State Domains

Để tránh một Store quá lớn và khó quản lý, Shared State được chia thành nhiều domain.

Các domain Customer, Product, Warranty và Repair dưới đây chỉ là snapshot/projection phục vụ workflow. Dữ liệu có thẩm quyền nằm trong PostgreSQL và chỉ Express được áp dụng thay đổi nghiệp vụ.

##### Conversation State

Lưu:

- Conversation ID
- Messages
- Attachments
- Streaming Status
- Active Thread

---

##### Customer State

Bao gồm:

- Customer Profile
- Contact
- Warranty History

---

##### Product State

Bao gồm:

- Product
- Model
- Serial Number
- Purchase Date
- Warranty Expiration

---

##### Warranty State

Bao gồm:

- Warranty Eligibility
- Current Status
- Evidence
- Rule Evaluation Result từ Express
- Confidence

---

##### Repair State

Bao gồm:

- Diagnosis
- Technician
- Parts
- Repair Progress
- Timeline

---

##### Workflow State

Bao gồm:

- Current Step
- Pending Actions
- Approval Status
- Interrupt State

---

#### State Synchronization

Shared State được đồng bộ theo hai chiều.

##### UI Interaction Ingress

Khi người dùng:

- chọn sản phẩm;
- tải tài liệu;
- thay đổi trạng thái;
- mở hồ sơ;

Frontend gửi tương tác tới Express. Express xác thực, cập nhật Redis Shared State hoặc PostgreSQL tùy loại dữ liệu, rồi chuyển workflow request tới FastAPI qua Internal HTTP. Không có kết nối UI → Agent trực tiếp.

---

##### AI Output Projection

Khi Agent:

- thêm Evidence;
- tạo Suggested Actions;
- cập nhật Confidence;
- sinh UI Schema;

FastAPI phát workflow output/state proposal cho Express. Express ghi Redis Shared State và phát event; Frontend nhận projection qua SSE rồi render lại. Không có kết nối Agent → UI trực tiếp.

---

##### Backend → Shared State

Sau khi một nghiệp vụ hoàn thành:

- trạng thái hồ sơ;
- tồn kho;
- lịch sử xử lý;

Express ghi business transaction vào PostgreSQL trước, sau đó phát State Patch vào Redis/event flow.

---

#### State Patch Protocol

Thay vì gửi toàn bộ State sau mỗi thay đổi, hệ thống chỉ truyền phần thay đổi.

Ví dụ:

```json
{
  "op": "replace",
  "path": "/warranty/status",
  "value": "approved"
}
```

Điều này:

- giảm băng thông;
- giảm render;
- hỗ trợ streaming.

---

#### Conflict Resolution

Trong trường hợp nhiều nguồn cùng cập nhật State.

Ví dụ:

- User
- Backend
- Agent

Shared State ưu tiên:

1. Backend
2. Human Input
3. Agent

Agent không được phép ghi đè quyết định của người dùng.

---

#### State Persistence

Không phải mọi State đều được lưu.

##### Persistent Business Data (PostgreSQL qua Express)

- Warranty Case
- Approval
- Timeline

##### Persistent Conversation / Workflow Data

- Messages trong PostgreSQL
- LangGraph checkpoint trong PostgreSQL checkpointer

---

##### Redis Shared State / Session

- Streaming
- Current Selection
- Planner State

---

##### Ephemeral

- Typing
- Loading
- Temporary UI

---

#### Event-driven Synchronization

Shared State được cập nhật thông qua Event.

Ví dụ:

```text
[Sequence Diagram]
Edges: [Sync HTTPS] · [Sync Internal HTTP] · [Async Redis Streams] · [SSE]
User Selected Product

↓

Express validates and updates Redis projection

↓

Express invokes FastAPI through Internal HTTP

↓

Planner Re-evaluates

↓

Redis Streams event

↓

Express SSE Gateway

↓

UI Updated
```

---

#### Observability

Mọi State Update đều được log.

Bao gồm:

- timestamp
- actor
- workflow
- previous value
- new value

Điều này hỗ trợ:

- debugging
- audit
- replay

---

#### Enterprise Vision — Future Extensions

Shared State được thiết kế để mở rộng:

- Multi-Agent Shared Context
- Cross-session State
- Cross-device Synchronization
- Collaborative Editing
- Distributed State

---

#### Deliverables

- Shared State Store
- State Patch Protocol
- Synchronization Engine
- Context Builder
- Event Bus
- Conflict Resolution
- Persistence Layer

---

### 79. Shared State

Shared State is maintained inside Redis.

Responsibilities:

* Current Workflow
* Conversation State
* Temporary Context
* UI Synchronization

Only state patches should be transmitted to the frontend.

---

### B.5 Shared State Synchronization

```text
[Sequence Diagram]
Edges: [Sync HTTPS] · [Sync Internal HTTP] · [Async Redis Streams] · [SSE]
User Action

↓

Express Gateway

↓

Redis Shared State

↓

Internal HTTP

↓

FastAPI AI Runtime

↓

Planner

↓

Redis Streams

↓

Express SSE Gateway

↓

Frontend Local Projection
```

---

### C.1 Shared State Schema

```yaml
conversation:

customer:

product:

warranty:

repair:

workflow:

approval:

ui:

memory:
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

- [ADR-002: PostgreSQL and Redis state ownership](../adr/ADR-002-postgresql-and-redis-state-ownership.md)
- [ADR-007: Human-in-the-loop workflow](../adr/ADR-007-human-in-the-loop-workflow.md)
- [ADR-010: Event-driven AI runtime](../adr/ADR-010-event-driven-ai-runtime.md)

## Related Documents

- [Technical Master Plan](./TECHNICAL_MASTER_PLAN.md)
- [Roadmap Master](../roadmap/ROADMAP_MASTER.md)
- [DevOps Master Plan](../platform/DEVOPS_MASTER_PLAN.md)
- [Glossary](../glossary/GLOSSARY.md)
