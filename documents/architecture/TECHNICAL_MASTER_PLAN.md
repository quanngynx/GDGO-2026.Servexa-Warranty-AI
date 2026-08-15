# Servexa Warranty AI — Technical Architecture Handbook

> **Document:** `TECHNICAL_MASTER_PLAN.md`<br>
> **Version:** 1.2<br>
> **Approval Status:** Approved Target Architecture<br>
> **Owner:** Architecture Working Group<br>
> **Review Frequency:** Quarterly<br>
> **Last Updated:** 2026-08-12<br>
> **Implementation Snapshot:** 2026-07-19; status is not a production-readiness certification<br>
> **Related Documents:** [`Production Completion Roadmap`](../production-readiness/PRODUCTION_COMPLETION_ROADMAP.md), [`ROADMAP_MASTER.md`](../roadmap/ROADMAP_MASTER.md), [`openwiki/quickstart.md`](../../openwiki/quickstart.md), [`Architecture Decisions`](../adr/)

## Handbook Navigation

| Reader goal | Start here |
| --- | --- |
| Understand boundaries and current constraints | [System Overview](./SYSTEM_OVERVIEW.md) |
| Understand FastAPI internals | [Agentic AI Architecture](./AI_RUNTIME.md#3-agentic-ai-architecture) |
| Understand data and service ownership | [Data Ownership Matrix](./SYSTEM_OVERVIEW.md#data-ownership-matrix) |
| Understand events and streaming | [Event & Streaming Architecture](./EVENT_ARCHITECTURE.md) |
| Operate or deploy the platform | [DevOps & Operations](../platform/DEVOPS_MASTER_PLAN.md) |
| Review future technologies | [Roadmap & Future Evolution](./AI_RUNTIME.md#future-evolution) |
| Review enterprise production gates | [Production Completion Roadmap](../production-readiness/PRODUCTION_COMPLETION_ROADMAP.md) |
| Resolve canonical terminology | [Glossary](../glossary/GLOSSARY.md) |

## Architecture Status Model

Every major architecture chapter uses two independent dimensions:

| Dimension | Allowed values | Meaning |
| --- | --- | --- |
| **Architecture Horizon** | Current Decision · Planned Evolution · Enterprise Vision | Whether the capability is an approved present boundary, a planned refinement, or a long-term option |
| **Implementation Status** | Implemented · Partial · Planned · Not Applicable | Repository evidence as of the implementation snapshot |

An approved **Current Decision** may still be **Partial** or **Planned** in code. Internal HTTP is the selected Express ↔ FastAPI boundary, while active gRPC paths remain implementation drift.

## Canonical Terms

The handbook uses [Express](../glossary/GLOSSARY.md#glossary-express), [FastAPI AI Runtime](../glossary/GLOSSARY.md#glossary-ai-runtime), [LangGraph](../glossary/GLOSSARY.md#glossary-langgraph), [Agent](../glossary/GLOSSARY.md#glossary-agent), [Planner](../glossary/GLOSSARY.md#glossary-planner), [Workflow](../glossary/GLOSSARY.md#glossary-workflow), [Workflow Coordinator](../glossary/GLOSSARY.md#glossary-workflow-coordinator), [Shared State](../glossary/GLOSSARY.md#glossary-shared-state), [Context Builder](../glossary/GLOSSARY.md#glossary-context-builder), [Tool](../glossary/GLOSSARY.md#glossary-tool), [Tool Registry](../glossary/GLOSSARY.md#glossary-tool-registry), [Tool Calling](../glossary/GLOSSARY.md#glossary-tool-calling), [Event Bus](../glossary/GLOSSARY.md#glossary-event-bus), [Evidence](../glossary/GLOSSARY.md#glossary-evidence), [Suggested Actions](../glossary/GLOSSARY.md#glossary-suggested-actions), [Reasoning Trace](../glossary/GLOSSARY.md#glossary-reasoning-trace), and [Fixed-schema Generative UI](../glossary/GLOSSARY.md#glossary-fixed-schema-generative-ui) consistently.

## Change History

| Version | Date | Change |
| --- | --- | --- |
| 1.2 | 2026-08-12 | Linked the production P0-P9 hard-gate roadmap without changing the implementation snapshot |
| 1.1 | 2026-07-19 | Added handbook governance, two-axis status, system constraints, ownership and flow matrices, runtime consolidation, NFR/governance controls, and roadmap alignment |
| 1.0 | 2026-07 | Consolidated technical master plan |

---


# Canonical Architecture Map

| Topic | Canonical handbook |
| --- | --- |
| System boundaries | [SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md) |
| Backend | [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) |
| Frontend | [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) |
| AI runtime | [AI_RUNTIME.md](./AI_RUNTIME.md) |
| Events and streaming | [EVENT_ARCHITECTURE.md](./EVENT_ARCHITECTURE.md) |
| Shared state | [SHARED_STATE.md](./SHARED_STATE.md) |
| Generative UI | [GENERATIVE_UI.md](./GENERATIVE_UI.md) |
| Reasoning and HITL | [REASONING.md](./REASONING.md) |
| Multimodal | [MULTIMODAL.md](./MULTIMODAL.md) |
| Security | [SECURITY.md](./SECURITY.md) |
| Observability | [OBSERVABILITY.md](./OBSERVABILITY.md) |
| Supporting architecture | [APPENDIX.md](./APPENDIX.md) |


# Part I. Foundation

---

# 1. Executive Summary

## Technical Vision

Servexa Warranty AI được thiết kế như một **Agentic AI Platform** thay vì một chatbot truyền thống. Mục tiêu của hệ thống không phải là tạo ra các câu trả lời tự nhiên nhất, mà là xây dựng một nền tảng AI có khả năng tham gia trực tiếp vào quy trình nghiệp vụ bảo hành với vai trò là một **AI Copilot** đáng tin cậy, có khả năng cộng tác cùng con người.

Kiến trúc kỹ thuật của hệ thống được xây dựng theo hướng **Agent-first**, trong đó AI trở thành trung tâm điều phối các hoạt động phân tích, truy xuất tri thức, suy luận và đề xuất hành động. Các thành phần Frontend, Backend và Knowledge Layer được thiết kế để hỗ trợ Agent thay vì hoạt động độc lập.

Toàn bộ kiến trúc hướng tới các mục tiêu:

- Có khả năng mở rộng từ MVP Hackathon lên Production.
- Hỗ trợ nhiều AI workflow.
- Có khả năng tích hợp nhiều mô hình AI khác nhau.
- Enterprise Vision: có thể mở rộng thành Multi-Agent Platform sau ADR và phê duyệt riêng.
- Đảm bảo khả năng kiểm toán, bảo mật và minh bạch.

---

## Technical Objectives

Toàn bộ kiến trúc được xây dựng nhằm đạt được các mục tiêu kỹ thuật sau:

### Build an Agentic Runtime

Xây dựng một Agent Runtime có khả năng:

- hiểu ngữ cảnh;
- lập kế hoạch;
- sử dụng tools;
- truy xuất tri thức;
- tương tác với giao diện;
- cộng tác cùng người dùng.

---

### Decouple Business Logic and AI

AI không chứa business logic.

Business Rule vẫn thuộc Express Backend.

AI chỉ:

- phân tích;
- suy luận;
- đề xuất;
- tổng hợp dữ liệu.

Điều này giúp:

- dễ kiểm thử;
- dễ thay đổi mô hình AI;
- tránh phụ thuộc vào LLM.

---

### AI-native User Experience

Toàn bộ giao diện được thiết kế theo hướng:

> UI phục vụ AI thay vì AI phục vụ UI.

Agent hiểu được trạng thái giao diện.

UI hiểu được trạng thái Agent.

Hai thành phần dùng cùng Business Context contract qua Express/Redis projection; không giao tiếp trực tiếp.

---

### Enterprise-ready Architecture

Hệ thống phải sẵn sàng mở rộng lên production:

- scalable;
- observable;
- secure;
- maintainable;
- testable.

---

## Architecture Philosophy

Kiến trúc của Servexa Warranty AI được xây dựng dựa trên sáu nguyên lý cốt lõi.

### Agent-centric

Agent là trung tâm.

Mọi thành phần khác đều phục vụ Agent.

---

### Context-first

Mọi quyết định đều dựa trên Context.

Không có prompt nào hoạt động độc lập.

---

### Evidence-driven

Không có Recommendation nào tồn tại nếu không có Evidence.

---

### Human-controlled

AI không trực tiếp thực hiện business action. AI chỉ đề xuất hoặc yêu cầu Tool; Express xác thực, áp dụng policy và thực thi.

---

### Streaming-first

Mọi tương tác đều ưu tiên streaming.

Bao gồm:

- Chat
- Tool
- UI
- Workflow

---

### Composable

Mọi thành phần đều có thể thay thế.

Ví dụ:

- đổi LLM
- Enterprise Vision: thay đổi pgvector adapter chỉ qua ADR riêng
- đổi Embedding
- đổi Workflow Engine

mà không cần thay đổi toàn bộ hệ thống.

---

## Engineering Principles

### Separation of Concerns

Frontend

↓

Backend

↓

AI Runtime

↓

Knowledge

↓

Infrastructure

được tách biệt hoàn toàn.

---

### Single Source of Truth

PostgreSQL qua Express là nguồn dữ liệu nghiệp vụ có thẩm quyền. Redis Shared State là nguồn context điều phối; Frontend chỉ giữ local projection và FastAPI chỉ nhận context theo contract.

---

### Progressive Enhancement

Mọi phase đều:

- deploy được
- demo được
- mở rộng được

---

### Explainability by Default

Mọi Recommendation đều:

- có Evidence
- có Confidence
- có Reasoning

---

### Schema over Prompt

Frontend không phụ thuộc Prompt.

Frontend chỉ phụ thuộc Schema.

---

## Non-goals

Các mục tiêu KHÔNG nằm trong phạm vi dự án:

- xây dựng Foundation Model
- train LLM
- thay thế ERP
- thay thế CRM
- tự động hóa hoàn toàn doanh nghiệp
- AI tự ra quyết định thay con người

---

# Conclusion

Servexa Warranty AI được thiết kế như một nền tảng AI có khả năng phát triển theo từng giai đoạn thay vì chỉ là một chatbot tích hợp LLM.

Kiến trúc hiện tại đặt nền móng cho:

- AI Copilot trong nghiệp vụ bảo hành.
- Workflow Automation có sự giám sát của con người.
- Event-driven & Streaming Architecture.
- Shared State và Generative UI.
- Enterprise Vision: Multi-Agent Runtime trong tương lai.
- Enterprise-scale Deployment.

Tài liệu này đóng vai trò là **Technical Architecture Handbook**, cung cấp định hướng thống nhất cho việc thiết kế, phát triển, triển khai và mở rộng Servexa Warranty AI trong suốt vòng đời của sản phẩm.
