# Generative UI

> Canonical handbook. The preserved source material remains under `documents/`.

## Purpose

Define fixed-schema Generative UI without allowing arbitrary generated application code.

## Scope

Schemas, component registry, validation, rendering, state binding, and fallback behavior.

## Dependencies

FastAPI proposes schemas, Express validates and transports them, and React owns rendering.

## Background

Background is provided by the linked master documentation.

## Architecture

### 12. Fixed-schema Generative UI

#### Architecture Status

| Architecture Horizon | Implementation Status |
| --- | --- |
| Current Decision | Partial |
| Planned Evolution | Complete schema coverage and component binding |
| Enterprise Vision | Optional adaptive layouts and widget ecosystems |

#### Design Principles

- AI emits data, never executable UI code.
- React owns rendering, accessibility and interaction.
- Express delivers schemas through SSE.
- Unsupported major versions fail safely.
- Generative UI is limited to registered components.

#### Overview

Generative UI là bước tiến từ AI trả lời bằng văn bản sang AI điều phối giao diện.

Thay vì sinh HTML hoặc JSX, Agent chỉ sinh một **UI Schema** theo định dạng chuẩn. Frontend chịu trách nhiệm ánh xạ schema này tới các component đã được xây dựng sẵn.

Thiết kế này giúp đảm bảo:

- tính bảo mật;
- tính nhất quán;
- khả năng kiểm thử;
- khả năng tái sử dụng.

---

#### Design Goals

- AI điều khiển UI bằng dữ liệu.
- Frontend không phụ thuộc Prompt.
- Mọi UI đều có schema.
- Dễ mở rộng component mới.
- Hỗ trợ streaming.

---

#### High-level Architecture

```text
[Component Diagram]
Reasoning
Cross-service edges: [Async Redis Streams] · [SSE]

↓

UI Generator

↓

UI Schema

↓

Redis Streams

↓

Express SSE Gateway

↓

Renderer

↓

React Components
```

---

#### UI Schema

Schema bao gồm:

```yaml
type:
id:
props:
layout:
actions:
state:
```

Frontend không đọc văn bản để quyết định render gì.

---

#### Component Registry

Mỗi loại schema được ánh xạ tới một Component.

Ví dụ:

| Schema     | Component           |
| ---------- | ------------------- |
| evidence   | EvidenceCard        |
| suggestion | SuggestedActionCard |
| approval   | ApprovalCard        |
| timeline   | Timeline            |
| warning    | AlertBanner         |
| summary    | SummaryCard         |

Registry giúp mở rộng UI mà không phải sửa Agent.

---

#### Supported Components

Hệ thống hỗ trợ nhiều nhóm component.

##### Information

- Summary
- Product
- Customer
- Warranty

---

##### Evidence

- Citation
- Document
- Source Preview

---

##### Workflow

- Timeline
- Progress
- Status

---

##### Decision

- Suggested Actions
- Approval
- Reject
- Escalation

---

##### Visualization

- Table
- List
- Badge
- KPI
- Chart (Planned Evolution)

---

#### Renderer

Renderer nhận UI Schema và:

- validate schema;
- chọn component;
- truyền props;
- bind Shared State;
- render.

Renderer không chứa business logic.

---

#### State Binding

Mỗi component đều có thể liên kết với Shared State.

Ví dụ:

```text
[Data Flow Diagram]
Warranty Status

↓

Shared State

↓

Status Card
```

Nếu trạng thái thay đổi, component tự động cập nhật.

---

#### Streaming UI

UI không cần chờ toàn bộ workflow.

Ví dụ:

```text
[Sequence Diagram]
Evidence

↓

Timeline

↓

Recommendation

↓

Approval
```

Mỗi component xuất hiện ngay khi dữ liệu sẵn sàng.

---

#### User Interaction

Component có thể phát sinh user interaction event.

Ví dụ:

Approve

↓

Express Approval API

↓

Authorization + Business Update

↓

Redis State Patch + LangGraph Resume

↓

Express SSE Event → Frontend

---

#### Schema Validation

Trước khi render:

- kiểm tra schema;
- kiểm tra version;
- kiểm tra component tồn tại;
- kiểm tra props.

Nếu không hợp lệ:

Fallback Renderer sẽ hiển thị thông báo an toàn.

---

#### Versioning

UI Schema cần hỗ trợ version.

Ví dụ:

```yaml
version: 1.0
```

Điều này cho phép Frontend và AI Runtime nâng cấp độc lập.

---

#### Planned Evolution — Future Extensions

- Adaptive Layout
- Responsive Schema
- Theme-aware UI
- Dynamic Dashboard
- Widget Marketplace

---

#### Deliverables

- UI Schema Specification
- Component Registry
- Renderer Engine
- Schema Validator
- Streaming Renderer
- State Binding Layer
- UI Event Protocol
- Schema Version Manager

### 22. Generative Components

#### Architecture Status

| Architecture Horizon | Implementation Status | Note |
| --- | --- | --- |
| Current Decision | Partial | Registry/rendering foundations exist; complete schema compatibility and fallback coverage remain incomplete. |

#### Overview

Generative Components là tập hợp các React Component có thể được AI điều khiển thông qua Fixed-schema UI.

Trong các vùng Generative UI, FastAPI tạo Schema, Express chuyển schema qua SSE và Renderer ánh xạ Schema sang Component tương ứng. Frontend vẫn quyết định app shell, navigation, accessibility và các màn hình nghiệp vụ cố định.

Điều này giúp hệ thống mở rộng dễ dàng mà không phải viết lại logic giao diện cho từng workflow mới.

---

#### Component Registry

Ví dụ:

```text
[Data Flow Diagram]
Schema

↓

Registry

↓

React Component
```

Registry ánh xạ:

| Schema Type | Component    |
| ----------- | ------------ |
| summary     | SummaryCard  |
| evidence    | EvidenceCard |
| timeline    | Timeline     |
| approval    | ApprovalCard |
| warning     | AlertBanner  |

---

#### Component Categories

##### Information

- Summary
- Product
- Warranty
- Customer

---

##### Evidence

- Citation
- Document Card
- File Preview

---

##### Workflow

- Timeline
- Progress
- Status

---

##### Decision

- Suggested Action
- Approval
- Reject
- Escalation

---

##### Visualization

- Table
- Badge
- KPI
- List

---

#### Rendering Flow

```text
[Data Flow Diagram]
UI Schema

↓

Validation

↓

Registry

↓

Component

↓

React Render
```

---

#### Schema Validation

Trước khi render:

- Version Check
- Type Check
- Required Props
- Security Validation

---

#### State Binding

Component không tự lưu Business State.

Component nhận local projection từ Express API/SSE; không đọc Redis hoặc FastAPI trực tiếp.

---

#### Fallback Strategy

Nếu gặp Schema chưa hỗ trợ:

```text
[Data Flow Diagram]
Unknown Schema

↓

Fallback Component

↓

Warning
```

Không làm crash UI.

---

#### Deliverables

- Component Registry
- Schema Validator
- Fallback Renderer
- State Binding
- Dynamic Layout Engine

---

### B.7 Generative UI

```text
[Sequence Diagram]
Edges: [Async Redis Streams] · [SSE]
Reasoning

↓

UI Generator

↓

JSON Schema

↓

Redis Streams

↓

Express SSE Gateway

↓

Renderer

↓

React Component
```

---

### C.9 UI Schema

```yaml
version:

type:

props:

layout:

children:

actions:
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

## Related ADRs

- [ADR-003: Fixed-schema Generative UI](../adr/ADR-003-fixed-schema-generative-ui.md)
- [ADR-004: Server-Sent Events streaming](../adr/ADR-004-server-sent-events-streaming.md)

## Related Documents

- [Technical Master Plan](./TECHNICAL_MASTER_PLAN.md)
- [Roadmap Master](../roadmap/ROADMAP_MASTER.md)
- [DevOps Master Plan](../platform/DEVOPS_MASTER_PLAN.md)
- [Glossary](../glossary/GLOSSARY.md)
