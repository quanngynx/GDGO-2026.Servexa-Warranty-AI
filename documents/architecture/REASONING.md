# Reasoning and Human Review

> Canonical handbook. The preserved source material remains under `documents/`.

## Purpose

Define explainable reasoning and human approval boundaries.

## Scope

HITL, reasoning traces, evidence, suggested actions, approvals, and continuation.

## Dependencies

Execution remains subject to business authorization and durable workflow state.

## Background

Background is provided by the linked master documentation.

## Architecture

### Part II-C. Human-in-the-loop, Reasoning Trace & Fixed-schema Generative UI

---

### 10. Human-in-the-loop (HITL)

#### Architecture Status

| Architecture Horizon | Implementation Status |
| --- | --- |
| Current Decision | Implemented |
| Planned Evolution | Multi-level approval and escalation |
| Enterprise Vision | Organization-wide delegated approval policy |

#### Design Principles

- AI proposes; humans decide; Express executes.
- Approval is persisted and auditable.
- LangGraph interrupts are resumable from PostgreSQL.
- Authorization is rechecked at decision and execution time.
- Timeout never implies approval.

#### Overview

Một trong những nguyên tắc quan trọng nhất của Servexa Warranty AI là **AI hỗ trợ con người ra quyết định, không thay thế con người**.

Trong môi trường doanh nghiệp, đặc biệt là các quy trình bảo hành, sửa chữa và hậu mãi, nhiều hành động có ảnh hưởng trực tiếp đến chi phí, quyền lợi khách hàng hoặc dữ liệu nghiệp vụ. Những hành động này không thể được thực hiện hoàn toàn tự động chỉ dựa trên kết quả từ mô hình AI.

Human-in-the-loop (HITL) được thiết kế như một lớp kiểm soát nhằm đảm bảo rằng AI luôn hoạt động dưới sự giám sát của con người đối với các quyết định quan trọng.

---

#### Design Goals

HITL hướng tới các mục tiêu:

- Giữ quyền quyết định cuối cùng cho con người.
- Tăng tính minh bạch của AI.
- Giảm rủi ro do AI suy luận sai.
- Đáp ứng yêu cầu kiểm toán.
- Hỗ trợ nhiều cấp phê duyệt.
- Có thể tiếp tục workflow sau khi được phê duyệt.

---

#### HITL Workflow

```text
[State Diagram]
AI Analysis
      │
      ▼
Recommendation
      │
      ▼
Approval Required?
      │
 ┌────┴────┐
 │         │
No        Yes
 │         │
 ▼         ▼
Express   Human Review
Executes
            │
            ▼
Approve / Reject / Modify
            │
            ▼
Workflow Resume
```

---

#### Approval Categories

Không phải mọi hành động đều yêu cầu HITL.

##### Read-only Actions

Ví dụ:

- tìm kiếm tài liệu;
- truy xuất lịch sử;
- phân tích hồ sơ.

AI có thể tự động yêu cầu các hành động read-only này; Express vẫn xác thực, phân quyền và thực thi truy vấn.

---

##### Low-risk Actions

Ví dụ:

- tạo ghi chú;
- sinh báo cáo;
- đề xuất kỹ thuật viên.

Có thể cho phép tự động trong tương lai.

---

##### Medium-risk Actions

Ví dụ:

- cập nhật trạng thái hồ sơ;
- thay đổi lịch sửa chữa;
- gửi email chính thức.

Có thể yêu cầu xác nhận từ người dùng.

---

##### High-risk Actions

Ví dụ:

- từ chối bảo hành;
- hoàn tiền;
- xuất linh kiện;
- đóng hồ sơ.

Luôn yêu cầu phê duyệt.

---

#### Approval Request Model

Khi cần phê duyệt, Agent sinh một Approval Object.

Ví dụ:

```yaml
action:
reason:
confidence:
evidence:
impact:
risk_level:
```

Frontend hiển thị Approval Card thay vì chỉ một đoạn văn.

---

#### Workflow Interrupt

Workflow không bị hủy.

Workflow chỉ chuyển sang trạng thái:

```text
[State Diagram]
Running

↓

Waiting Approval

↓

Resume
```

LangGraph ghi checkpoint vào PostgreSQL trước khi interrupt, nhờ đó workflow giữ nguyên Context một cách bền vững và có thể resume sau restart.

---

#### Resume Strategy

Sau khi người dùng phản hồi:

Approve

↓

Express Authorization + Decision API

↓

PostgreSQL Business Update + Redis State Patch

↓

LangGraph Resume from PostgreSQL Checkpoint

Không cần chạy lại toàn bộ Agent.

---

#### Reject Flow

Nếu người dùng từ chối:

Workflow

↓

Reason Update

↓

Planner

↓

Alternative Recommendation

Agent có thể đề xuất phương án khác.

---

#### Modify Flow

Người dùng có thể đề nghị sửa:

- Technician
- Repair Date
- Warranty Decision

Frontend gửi thay đổi tới Express. Express xác thực quyền, áp dụng business rule và ghi PostgreSQL; sau đó Express cập nhật Redis Shared State và resume LangGraph từ PostgreSQL checkpoint. Agent không trực tiếp cập nhật các trường nghiệp vụ.

---

#### Permission Integration

Approval phụ thuộc:

- User Role
- Business Rule
- Workflow Type
- Action Category

Không phải mọi người dùng đều có quyền phê duyệt.

---

#### Audit Trail

Mọi Approval đều được ghi nhận:

- approver
- timestamp
- decision
- previous state
- new state
- evidence
- reasoning

---

#### Failure Handling

Nếu người dùng không phản hồi:

Workflow

↓

Timeout

↓

Notify

↓

Archive

---

#### Planned Evolution — Future Extensions

- Multi-level Approval
- Department Approval
- AI Confidence Threshold
- Auto Approval Policy
- Escalation Workflow

---

#### Deliverables

- Approval Engine
- Workflow Interrupt
- Resume Engine
- Approval Card
- Permission Integration
- Audit Trail

---

### 11. Reasoning Trace

#### Architecture Status

| Architecture Horizon | Implementation Status |
| --- | --- |
| Current Decision | Partial |
| Planned Evolution | Complete trace coverage and evaluation |
| Enterprise Vision | Cross-agent trace aggregation |

#### Design Principles

- Show evidence-backed explanation, never hidden Chain of Thought.
- Explain Express business-rule results rather than reimplementing rules.
- Confidence communicates uncertainty and missing data.
- Every trace is attributable to workflow, model and source versions.

#### Overview

Một trong những vấn đề lớn nhất của AI hiện đại là người dùng không biết **vì sao** AI đưa ra một kết luận.

Servexa Warranty AI không hiển thị Chain of Thought nội bộ của mô hình ngôn ngữ, nhưng luôn cung cấp một **Reasoning Trace** có cấu trúc để người dùng hiểu được quá trình ra quyết định.

Reasoning Trace không nhằm mô phỏng suy nghĩ của AI mà nhằm giải thích:

- AI đã xem xét những dữ liệu nào.
- Kết quả quy tắc nào từ Express đã được dùng.
- AI đánh giá mức độ tự tin ra sao.
- Vì sao AI đưa ra Recommendation.

---

#### Design Goals

- Explainability
- Transparency
- Trust
- Auditability
- Business Traceability

---

#### Architecture

```text
[Component Diagram]
Context

↓

Evidence

↓

Business Rule Results (Express)

↓

Tool Results

↓

Reasoning Summary

↓

Recommendation
```

---

#### Reasoning Layers

##### Context Understanding

Agent xác định:

- Product
- Warranty Case
- User Intent
- Conversation Context

---

##### Evidence Collection

Danh sách tài liệu được sử dụng.

Ví dụ:

- Warranty Policy
- Invoice
- Repair History

---

##### Rule Result Explanation

Express đánh giá điều kiện nghiệp vụ và trả kết quả có cấu trúc. Agent chỉ giải thích:

- điều kiện bảo hành;
- thời hạn;
- ngoại lệ.

---

##### Confidence Estimation

Confidence được xây dựng từ:

- Retrieval Quality
- Rule Matching
- Tool Success
- Data Completeness

Không dựa đơn thuần vào xác suất của LLM.

---

##### Recommendation

Sau khi tổng hợp toàn bộ dữ liệu, Agent sinh:

- Recommendation
- Alternative
- Risk
- Suggested Actions

---

#### User-visible Trace

Frontend có thể hiển thị:

```text
[Data Flow Diagram]
Evidence

↓

Rules Applied

↓

Analysis Summary

↓

Confidence

↓

Recommendation
```

Không hiển thị Prompt hoặc Chain of Thought.

---

#### Confidence Model

Confidence chia thành:

High

Medium

Low

Ngoài giá trị số, hệ thống nên giải thích nguyên nhân làm giảm độ tin cậy.

Ví dụ:

- thiếu hóa đơn;
- tài liệu chưa đầy đủ;
- nhiều quy định mâu thuẫn.

---

#### Explainability Principles

Reasoning Trace phải:

- ngắn gọn;
- có cấu trúc;
- dựa trên Evidence;
- dễ hiểu đối với nhân viên nghiệp vụ.

---

#### Integration

Reasoning Trace liên kết với:

- Shared State
- Evidence
- Suggested Actions
- Approval

---

#### Deliverables

- Reasoning Builder
- Confidence Engine
- Rule Explanation
- Evidence Mapping
- Reasoning Summary Generator

---

### B.4 Human-in-the-loop

```text
[Sequence Diagram]
Edge: [Sync Internal HTTP]
AI

↓

Recommendation

↓

LangGraph Interrupt

↓

PostgreSQL LangGraph Checkpoint

↓

Approval Card

↓

User Decision

↓

Express Approval API

↓

Authorization + PostgreSQL Update

↓

Redis State Patch

↓

FastAPI Resume Request

↓

LangGraph Loads Checkpoint / Planner Resume

↓

Workflow Continue
```

---

### C.3 Evidence Schema

```yaml
id:

source:

document:

page:

chunk:

score:

metadata:
```

---

### C.4 Suggested Action Schema

```yaml
id:

title:

description:

type:

risk:

confidence:

requiresApproval:
```

---

### C.5 Approval Schema

```yaml
action:

reason:

confidence:

risk:

evidence:

approvedBy:
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

- [ADR-007: Human-in-the-loop workflow](../adr/ADR-007-human-in-the-loop-workflow.md)
- [ADR-006: Tool Registry and Tool Calling](../adr/ADR-006-tool-registry-and-tool-calling.md)

## Related Documents

- [Technical Master Plan](./TECHNICAL_MASTER_PLAN.md)
- [Roadmap Master](../roadmap/ROADMAP_MASTER.md)
- [DevOps Master Plan](../platform/DEVOPS_MASTER_PLAN.md)
- [Glossary](../glossary/GLOSSARY.md)
