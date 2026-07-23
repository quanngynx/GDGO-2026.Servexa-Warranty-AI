# Future Roadmap

> Canonical handbook. The preserved source material remains under `documents/`.

## Purpose

Preserve long-term capability options without promoting them to current decisions.

## Scope

Future phases, enterprise capability horizons, and continuous improvement.

## Dependencies

Future adoption requires measurement, architecture review, and an approved ADR.

## Background

Background is provided by the linked master documentation.

## Architecture

The canonical architecture is defined in the related handbooks below.

## Design Principles

Apply the approved boundaries, ownership rules, and status classifications preserved in this handbook.

## Implementation

Implementation details remain governed by the architecture and contracts referenced above.

## Best Practices

Keep current decisions separate from Planned Evolution and Enterprise Vision material.

## Future Evolution

### Future Roadmap

> **Architecture Horizon:** Enterprise Vision<br>
> **Implementation Status:** Not Applicable to current production claims

All phases in this section require separate ADRs, security review, operational evidence and explicit approval before becoming Current Decisions.

#### Vision Beyond MVP

Roadmap hiện tại tập trung vào việc xây dựng một Agentic AI Copilot phục vụ quy trình bảo hành. Tuy nhiên, đây chỉ là bước đầu trong chiến lược phát triển dài hạn.

Trong tương lai, Servexa Warranty AI hướng tới trở thành một nền tảng AI có khả năng hỗ trợ nhiều quy trình hậu mãi khác nhau như bảo trì, sửa chữa, quản lý linh kiện, hỗ trợ kỹ thuật và chăm sóc khách hàng.

Kiến trúc hiện tại được thiết kế để có thể mở rộng mà không cần thay đổi nền tảng cốt lõi.

---

#### Phase 9 — Multi-Agent Collaboration

**Enterprise Vision — not implemented.**

Sau khi Subgraphs Streaming ổn định, hệ thống có thể phát triển thành nhiều Agent chuyên biệt cùng phối hợp xử lý một hồ sơ.

Ví dụ:

- Retrieval Agent.
- Policy Agent.
- Diagnostic Agent.
- Inventory Agent.
- Scheduling Agent.
- Reporting Agent.

Một Coordinator Agent sẽ chịu trách nhiệm lập kế hoạch, điều phối và tổng hợp kết quả.

---

#### Phase 10 — Autonomous Workflow

**Enterprise Vision — not implemented.**

Trong giai đoạn này, AI có thể tự động yêu cầu các tác vụ có mức độ rủi ro thấp theo policy đã cấu hình mà không cần người dùng phê duyệt. Express vẫn xác thực, áp dụng business rule, audit và thực thi mọi business action.

Ví dụ:

- cập nhật trạng thái;
- gửi email;
- tạo ghi chú;
- nhắc lịch;
- đồng bộ dữ liệu.

Những hành động quan trọng vẫn duy trì Human-in-the-loop.

---

#### Phase 11 — Enterprise Knowledge Network

**Enterprise Vision — not implemented.**

Knowledge Base sẽ không chỉ giới hạn trong tài liệu bảo hành.

FastAPI chỉ tiếp cận dữ liệu doanh nghiệp qua Express-managed tools/connectors tới:

- ERP.
- CRM.
- Inventory.
- Product Catalog.
- Internal Wiki.
- SOP Repository.
- Ticketing System.

Điều này giúp AI có cái nhìn toàn diện hơn về hoạt động của doanh nghiệp.

---

#### Phase 12 — Predictive Warranty Intelligence

**Enterprise Vision — not implemented.**

AI không chỉ phản ứng với yêu cầu hiện tại mà còn dự đoán các vấn đề trong tương lai.

Ví dụ:

- phát hiện sản phẩm có nguy cơ hỏng cao;
- cảnh báo linh kiện sắp hết;
- dự đoán thời gian sửa chữa;
- đề xuất phân bổ kỹ thuật viên.

---

#### Phase 13 — AI Operations Platform

**Enterprise Vision — not implemented.**

Trong giai đoạn trưởng thành, Servexa Warranty AI trở thành một nền tảng AI dùng chung cho toàn bộ doanh nghiệp.

Các module có thể mở rộng gồm:

- AI Command Center.
- AI Analytics Dashboard.
- AI Workflow Builder.
- Prompt Management.
- Tool Marketplace.
- Knowledge Management.
- Agent Monitoring.
- AI Governance.

---

#### Continuous Improvement

Sau mỗi lần triển khai, nhóm phát triển sẽ liên tục đánh giá:

- chất lượng câu trả lời;
- hiệu quả Retrieval;
- độ chính xác của Evidence;
- mức độ hài lòng của người dùng;
- thời gian xử lý hồ sơ;
- chi phí vận hành AI.

Các chỉ số này sẽ là cơ sở để cải tiến prompt, workflow, knowledge base và mô hình AI.

---

## References

- [Legacy source](../../documents/ROADMAP_MASTER.md)

## Related ADRs

- [ADR-001: AI-native architecture](../adr/ADR-001-ai-native-architecture.md)

## Related Documents

- [Roadmap Master](./ROADMAP_MASTER.md)
- [Technical Master Plan](../architecture/TECHNICAL_MASTER_PLAN.md)
- [DevOps Master Plan](../platform/DEVOPS_MASTER_PLAN.md)
- [Glossary](../glossary/GLOSSARY.md)
