# Frontend Architecture

> Canonical handbook. The preserved source material remains under `documents/`.

## Purpose

Define the React application structure and its interaction with canonical backend contracts.

## Scope

Application layers, Copilot panel, state integration, rendering, accessibility, and streaming UX.

## Dependencies

The browser communicates through Express and consumes only approved API and SSE contracts.

## Background

Background is provided by the linked master documentation.

## Architecture

### Part IV. Frontend Architecture

---

### 20. Frontend Architecture

#### Architecture Status

| Architecture Horizon | Implementation Status | Note |
| --- | --- | --- |
| Current Decision | Partial | React rendering and event handling exist; the single Express SSE Gateway and full Shared State projection are incomplete. |

#### Overview

Frontend của Servexa Warranty AI là presentation client, không phải một phần của Agent Runtime. Frontend chỉ giao tiếp với Express, giữ local Shared State projection, xử lý SSE event và render Fixed-schema Generative UI.

Khác với các ứng dụng CRUD truyền thống, Frontend hoạt động như một **AI Workspace**: người dùng thao tác qua Express, còn AI làm việc trên context projection được Express cung cấp.

---

#### Design Goals

Frontend Architecture hướng tới:

- AI-native User Experience.
- Streaming-first Interaction.
- State-driven Rendering.
- Component-based Design.
- Extensible AI Workspace.
- High Performance.
- Accessibility.
- Responsive Design.

---

#### High-level Architecture

```text
[Component Diagram]
                        Browser
                    │
                    ▼
              React Application
                    │
     ┌──────────────┼──────────────┐
     ▼              ▼              ▼
 App Shell   Local Projection  SSE Event Processor
     │              │              │
     └──────────────┼──────────────┘
                    ▼
            AI Copilot Panel
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
 Chat UI      Evidence UI   Workflow UI
                    │
                    ▼
            Generative Renderer
                    │
                    ▼
               React Components
```

---

#### Application Layers

##### App Shell

Chịu trách nhiệm:

- Routing
- Layout
- Navigation
- Theme
- Authentication UI/session handling (Express xác thực)
- Global Providers

---

##### State Layer

Quản lý:

- Shared State
- Local projection only
- UI State
- Session State
- Conversation State

---

##### AI Experience Layer

Bao gồm:

- Copilot Panel
- SSE Client
- Event Processor
- UI Renderer

---

##### Component Layer

Bao gồm:

- Business Components
- AI Components
- Shared Components

---

#### Frontend Technology Stack

- React
- TypeScript
- TanStack Query
- TailwindCSS
- Shadcn UI
- React Hook Form
- Zod
- AG-UI Protocol

---

#### Shared State Integration

Frontend không sở hữu Business State. PostgreSQL qua Express là business source of truth; Frontend chỉ giữ projection nhận từ Express API/SSE.

Ví dụ:

```text
[Data Flow Diagram]
Edges: [Sync HTTPS] · [SSE]
Backend

↓

Express API / SSE

↓

Local Shared State Projection

↓

React Components
```

---

#### Event-driven UI

Mọi thay đổi UI đều được kích hoạt thông qua Event.

Ví dụ:

```text
[Sequence Diagram]
Approval

↓

Express API

↓

Authorized business update + state.patch SSE

↓

UI Update
```

Không component nào trực tiếp thay đổi Business Context.

---

#### Streaming-first Rendering

Frontend luôn ưu tiên Streaming.

Bao gồm:

- Token Streaming
- Tool Events
- Progress Events
- UI Schema Streaming
- Workflow Streaming

---

#### Performance Strategy

Frontend sử dụng:

- Lazy Loading
- Route Splitting
- Component Memoization
- Virtual List
- Streaming Rendering

---

#### Deliverables

- App Shell
- Shared State Integration
- SSE Event Processor
- Local Projection Store
- AI Workspace
- Responsive Layout

---

### 21. AI Copilot Panel

#### Architecture Status

| Architecture Horizon | Implementation Status | Note |
| --- | --- | --- |
| Current Decision | Partial | Core workspace surfaces exist; Evidence, trace, state projection and streaming coverage vary by capability. |

#### Overview

AI Copilot Panel là trung tâm tương tác giữa người dùng và Agent.

Đây không phải một cửa sổ chat thông thường mà là một **AI Workspace**, nơi AI hiển thị hội thoại, Evidence, Suggested Actions, Timeline và các thành phần Generative UI trong cùng một không gian.

Mục tiêu của Copilot Panel là giúp người dùng vừa trao đổi với AI vừa thực hiện công việc mà không phải chuyển đổi giữa nhiều màn hình.

---

#### Design Principles

Copilot Panel cần:

- luôn hiển thị ngữ cảnh hiện tại;
- hỗ trợ workflow dài;
- hỗ trợ streaming;
- không che khuất giao diện chính;
- có thể mở rộng thêm nhiều loại component.

---

#### Layout Structure

```text
───────────────────────────────

Conversation

───────────────────────────────

Evidence

───────────────────────────────

Reasoning

───────────────────────────────

Suggested Actions

───────────────────────────────

Workflow Timeline

───────────────────────────────

Approval

───────────────────────────────
```

---

#### Chat Section

Bao gồm:

- User Messages
- Assistant Messages
- Streaming Tokens
- Attachments

---

#### Evidence Panel

Hiển thị:

- Documents
- PDF
- Warranty Policy
- Similar Cases
- Metadata

Cho phép:

- Preview
- Citation
- Expand

---

#### Reasoning Panel

Hiển thị:

- Analysis Summary
- Business Rule Result
- Confidence
- Risk

Không hiển thị Chain of Thought.

---

#### Suggested Actions

Có thể hiển thị:

- Approve
- Reject
- Assign Technician
- Open Document
- View History

---

#### Timeline

Timeline phản ánh toàn bộ workflow.

Ví dụ:

```text
[State Diagram]
Question

↓

Retrieval

↓

Reasoning

↓

Recommendation

↓

Approval

↓

Completed
```

---

#### Approval Section

Cho phép:

- Approve
- Reject
- Modify

Mọi thao tác đều phát sinh Event.

---

#### Context Awareness

Copilot Panel luôn biết:

- Product hiện tại
- Warranty Case
- Customer
- Workflow Step

Không cần người dùng nhập lại.

---

#### Deliverables

- Chat UI
- Evidence Panel
- Timeline
- Suggested Actions
- Approval UI
- Context Indicator

---

### 23. Streaming UX

#### Architecture Status

| Architecture Horizon | Implementation Status | Note |
| --- | --- | --- |
| Current Decision | Partial | SSE is the only approved browser streaming protocol; end-to-end gateway coverage remains Planned Evolution. |

#### Overview

Streaming là một nguyên tắc cốt lõi trong trải nghiệm người dùng của Servexa Warranty AI.

Người dùng không nên chờ toàn bộ workflow hoàn thành mới nhìn thấy kết quả. Thay vào đó, hệ thống liên tục hiển thị tiến trình xử lý theo thời gian thực.

Điều này giúp giảm cảm giác chờ đợi và tăng tính minh bạch trong quá trình AI hoạt động.

---

#### Streaming Flow

```text
[Sequence Diagram]
Edges: [Sync HTTPS] · [Sync Internal HTTP] · [Async Redis Streams] · [SSE]
User

↓

Express Gateway

↓ Internal HTTP

FastAPI AI Runtime

↓

Redis Streams

↓

Express SSE Gateway

↓

Frontend

↓

Incremental Rendering
```

---

#### Streaming Types

##### Token Streaming

Hiển thị từng token văn bản.

---

##### Tool Streaming

Hiển thị:

- Tool Started
- Tool Finished
- Tool Failed

---

##### Retrieval Streaming

Hiển thị:

- Searching...
- Documents Found
- Ranking...

---

##### Reasoning Streaming

Hiển thị:

- Evidence Ready
- Business Rule Result
- Confidence Updated

---

##### UI Streaming

Render từng Component ngay khi sẵn sàng.

Ví dụ:

Evidence

↓

Timeline

↓

Recommendation

↓

Approval

---

##### Workflow Streaming

Hiển thị tiến trình tổng thể.

Ví dụ:

```text
[State Diagram]
Running

↓

Waiting Approval

↓

Resumed

↓

Completed
```

---

#### Loading Strategy

Không sử dụng Spinner toàn màn hình.

Ưu tiên:

- Skeleton
- Progressive Loading
- Placeholder Components
- Inline Status

---

#### Interrupt Handling

Nếu workflow bị dừng:

Frontend hiển thị:

- Waiting Approval
- Retry
- Resume

---

#### Error Handling

Nếu một Event thất bại:

- hiển thị Warning;
- giữ nguyên các phần đã render;
- cho phép Retry.

Không reset toàn bộ giao diện.

---

#### Accessibility

Streaming UI cần:

- hỗ trợ Screen Reader;
- không gây Layout Shift lớn;
- giữ Focus hợp lý;
- đảm bảo Keyboard Navigation.

---

#### Performance Optimization

Áp dụng:

- Event Batching
- Incremental Rendering
- Memoization
- Windowing
- Lazy Hydration (Planned Evolution)

---

#### Deliverables

- Streaming Renderer
- Event Processor
- Progressive Rendering
- Skeleton System
- Error Recovery
- Accessibility Support
- Performance Optimization Framework

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
- [ADR-003: Fixed-schema Generative UI](../adr/ADR-003-fixed-schema-generative-ui.md)
- [ADR-004: Server-Sent Events streaming](../adr/ADR-004-server-sent-events-streaming.md)

## Related Documents

- [Technical Master Plan](./TECHNICAL_MASTER_PLAN.md)
- [Roadmap Master](../roadmap/ROADMAP_MASTER.md)
- [DevOps Master Plan](../platform/DEVOPS_MASTER_PLAN.md)
- [Glossary](../glossary/GLOSSARY.md)
