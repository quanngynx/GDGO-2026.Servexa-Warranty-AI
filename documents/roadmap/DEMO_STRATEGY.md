# Demo Strategy

> Canonical handbook. The preserved source material remains under `documents/`.

## Purpose

Define how Servexa Warranty AI capabilities are demonstrated safely and coherently.

## Scope

Demo maturity, objectives, scenarios, principles, and success criteria.

## Dependencies

Demo claims depend on the implementation status and run modes documented by the master plans.

## Background

Background is provided by the linked master documentation.

## Architecture

The canonical architecture is defined in the related handbooks below.

## Design Principles

Apply the approved boundaries, ownership rules, and status classifications preserved in this handbook.

## Implementation

### Demo Strategy

#### Demo Maturity and Run Modes

| Demo scope | Minimum phase gate | Supported run mode | Claim limit |
| --- | --- | --- | --- |
| Chat and basic tools | Phase 1 | Local Development, Demo | No Evidence or production-SSE claim |
| Evidence and Suggested Actions | Phase 2 | Local Development, Demo | Partial capability; no automatic business action |
| Shared State projection | Phase 3 | Local Development, Demo | Partial adapter/patch maturity must be disclosed |
| HITL workflow | Phase 4 | Demo, Staging | Implemented approval path; Internal HTTP migration debt remains |
| Reasoning and Generative UI | Phase 5–6 | Demo, Staging | Partial coverage; show only verified components and traces |
| Subgraph streaming | Phase 7 | Staging | Partial capability; no distributed-runtime claim |
| Multimodal | Phase 8 | Not yet supported as current demo | Planned Evolution |

Production may be claimed only after the relevant phase exit criterion, [Non-functional Requirements](../architecture/APPENDIX.md#23a-non-functional-requirements), failure recovery and operational checks are measured in the Production run mode.

#### Demo Objectives

Servexa Warranty AI không hướng đến việc trình diễn một chatbot có thể trả lời nhiều câu hỏi, mà hướng đến việc chứng minh rằng Agentic AI có thể tham gia trực tiếp vào quy trình vận hành bảo hành của doanh nghiệp. Vì vậy, chiến lược demo tập trung vào việc thể hiện quá trình AI hỗ trợ ra quyết định thay vì chỉ thể hiện khả năng sinh văn bản.

Mỗi tính năng được trình diễn cần trả lời ba câu hỏi:

- AI đang hiểu điều gì?
- AI đang hỗ trợ quyết định gì?
- AI mang lại giá trị gì cho người dùng?

Toàn bộ demo phải tạo cảm giác AI đang cộng tác với người dùng trên cùng một giao diện thay vì hoạt động như một cửa sổ chat độc lập.

---

#### Demonstration Principles

Toàn bộ quá trình trình diễn được xây dựng theo các nguyên tắc sau:

##### Demonstrate Business Value First

Thay vì bắt đầu bằng việc giới thiệu công nghệ, demo sẽ bắt đầu bằng một tình huống nghiệp vụ thực tế. Người xem cần hiểu vấn đề trước khi nhìn thấy giải pháp.

Ví dụ:

> Một khách hàng mang sản phẩm đến trung tâm bảo hành nhưng nhân viên mất nhiều thời gian để xác định điều kiện bảo hành, tra cứu tài liệu và đưa ra quyết định.

Sau đó mới giới thiệu cách Servexa Warranty AI giải quyết toàn bộ quy trình.

---

##### Show AI Collaboration Instead of Automation

AI không thay thế con người.

Trong suốt quá trình demo, AI sẽ:

- phân tích;
- truy xuất tri thức;
- giải thích;
- đề xuất hành động;

nhưng người dùng vẫn là người đưa ra quyết định cuối cùng.

Điều này giúp tạo niềm tin và phản ánh đúng định hướng Human-in-the-loop của sản phẩm.

---

##### Explain Every Recommendation

Mọi đề xuất của AI đều phải đi kèm:

- Evidence.
- Reasoning Summary.
- Confidence.
- Suggested Actions.

Không có bất kỳ kết luận quan trọng nào được hiển thị mà thiếu căn cứ.

---

##### Demonstrate Progressive Capabilities

Demo sẽ thể hiện quá trình AI phát triển từng bước thay vì bật tất cả tính năng cùng lúc.

Người xem sẽ thấy AI:

1. hiểu câu hỏi;
2. tìm tài liệu;
3. giải thích;
4. đề xuất;
5. cập nhật giao diện;
6. chờ người dùng phê duyệt;
7. hoàn thành workflow.

Điều này phản ánh đúng roadmap phát triển của dự án.

---

#### Demo Scenario

Kịch bản đầy đủ dưới đây chỉ là release gate sau khi hoàn thành Phase 6 cùng toàn bộ prerequisites Phase 0–5. Trước đó, Phase 1 chỉ demo chat/SSE; Phase 2 demo evidence/suggested actions; Phase 3 demo state projection; Phase 4 demo approval/resume; Phase 5 demo structured trace.

Một kịch bản trình diễn tiêu chuẩn được đề xuất như sau.

##### Step 1 — Case Intake

Người dùng mở một hồ sơ bảo hành và đặt câu hỏi:

> "Thiết bị này có đủ điều kiện bảo hành không?"

AI bắt đầu phân tích hồ sơ.

---

##### Step 2 — Retrieval

AI truy xuất:

- Warranty Policy.
- Technical Documentation.

FastAPI đọc các knowledge source trên trực tiếp từ pgvector. Product Information và Repair History là business data, được Context Builder lấy qua Express Business API và trình bày tách biệt với RAG Evidence.

Evidence xuất hiện ngay trong Copilot Panel.

---

##### Step 3 — Analysis

AI tổng hợp:

- tình trạng sản phẩm;
- điều kiện bảo hành;
- các điều khoản liên quan.

Reasoning Summary bắt đầu được hiển thị.

---

##### Step 4 — Suggested Actions

AI đề xuất:

- Approve Warranty.
- Assign Technician.
- Order Spare Part.

Các Action Card xuất hiện trực tiếp trên giao diện.

---

##### Step 5 — Human Approval

Người dùng xem:

- Evidence.
- Confidence.
- Business Rule Result.
- Suggested Actions.

Sau đó nhấn **Approve**.

---

##### Step 6 — Workflow Execution

Express xác thực quyết định, áp dụng business rule và cập nhật trạng thái hồ sơ trong PostgreSQL.

Express cập nhật Redis Shared State và gửi state patch qua SSE.

Toàn bộ giao diện tự động cập nhật.

---

##### Step 7 — Completion

AI hiển thị:

- kết quả cuối cùng;
- timeline xử lý;
- các bước tiếp theo nếu cần.

Workflow hoàn tất.

---

#### Demo Success Criteria

Một buổi demo được xem là thành công khi người xem có thể dễ dàng nhận ra:

- AI hiểu ngữ cảnh của hồ sơ.
- AI không trả lời dựa trên suy đoán.
- AI luôn có bằng chứng.
- AI giải thích được quyết định.
- AI hỗ trợ thao tác trên giao diện.
- AI không thay thế con người.
- Toàn bộ workflow diễn ra liền mạch.

Nếu người xem chỉ nhớ rằng "đây là một chatbot", demo được xem là chưa đạt mục tiêu.

---

#### Enterprise Vision — Future Demo Scenarios

Sau khi Phase 8 đạt exit criterion, Demo có thể hỗ trợ phân tích ảnh và OCR. Các kịch bản dưới đây là **Enterprise Vision demo variants** dùng lại năng lực đã được xác minh hoặc kết hợp thêm năng lực hậu-roadmap:

- Phân tích ảnh sản phẩm hỏng.
- OCR hóa đơn và phiếu bảo hành.
- So sánh nhiều trường hợp tương tự.
- Điều phối nhiều Agent cùng xử lý một hồ sơ.
- Dashboard theo dõi tiến độ xử lý thời gian thực.
- Tự động tạo báo cáo sau khi hoàn tất quy trình.

---

## Best Practices

Keep current decisions separate from Planned Evolution and Enterprise Vision material.

## Future Evolution

Future changes require the review and ADR controls described in the related documents.

## References

- [Legacy source](../../documents/ROADMAP_MASTER.md)

## Related ADRs

- [ADR-001: AI-native architecture](../adr/ADR-001-ai-native-architecture.md)
- [ADR-007: Human-in-the-loop workflow](../adr/ADR-007-human-in-the-loop-workflow.md)

## Related Documents

- [Roadmap Master](./ROADMAP_MASTER.md)
- [Technical Master Plan](../architecture/TECHNICAL_MASTER_PLAN.md)
- [DevOps Master Plan](../platform/DEVOPS_MASTER_PLAN.md)
- [Glossary](../glossary/GLOSSARY.md)
