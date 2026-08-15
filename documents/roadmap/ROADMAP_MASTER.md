# GDGO-2026 Servexa Warranty AI

> **ROADMAP_MASTER.md**
>
> Version: 1.2
>
> Approval Status: Approved Target Architecture
>
> Owner: Architecture Working Group
>
> Review Frequency: Quarterly
>
> Last Updated: 2026-08-12
>
> Implementation Snapshot: 2026-07-19; status is not a production-readiness certification
>
> Related Documents: [`Production Completion Roadmap`](../production-readiness/PRODUCTION_COMPLETION_ROADMAP.md), [`TECHNICAL_MASTER_PLAN.md`](../architecture/TECHNICAL_MASTER_PLAN.md), [`openwiki/quickstart.md`](../../openwiki/quickstart.md), [`Architecture Decisions`](../adr/)

---

## Roadmap Navigation

| Reader goal | Start here |
| --- | --- |
| Understand status semantics | [Architecture and Implementation Status](#architecture-and-implementation-status) |
| Review phase order and maturity | [Phase Status Summary](./DEVELOPMENT_PHASES.md#phase-status-summary) |
| Review production release gates | [Production Completion Roadmap](../production-readiness/PRODUCTION_COMPLETION_ROADMAP.md) |
| Review delivery gates | [Development Strategy](./DEVELOPMENT_PHASES.md#development-strategy) |
| Prepare a demonstration | [Demo Strategy](./DEMO_STRATEGY.md#demo-strategy) |
| Review long-term options | [Future Roadmap](./FUTURE_ROADMAP.md#future-roadmap) |

## Architecture and Implementation Status

| Dimension | Allowed values | Meaning |
| --- | --- | --- |
| **Architecture Horizon** | Current Decision · Planned Evolution · Enterprise Vision | Approved boundary, planned refinement, or long-term option |
| **Implementation Status** | Implemented · Partial · Planned · Not Applicable | Repository evidence at the snapshot date |

Current Decision does not imply complete implementation. For example, Internal HTTP is approved while active gRPC paths remain migration debt.

Canonical terms link to the technical glossary: [Express](../glossary/GLOSSARY.md#glossary-express), [FastAPI AI Runtime](../glossary/GLOSSARY.md#glossary-ai-runtime), [LangGraph](../glossary/GLOSSARY.md#glossary-langgraph), [Agent](../glossary/GLOSSARY.md#glossary-agent), [Planner](../glossary/GLOSSARY.md#glossary-planner), [Workflow](../glossary/GLOSSARY.md#glossary-workflow), [Workflow Coordinator](../glossary/GLOSSARY.md#glossary-workflow-coordinator), [Shared State](../glossary/GLOSSARY.md#glossary-shared-state), [Context Builder](../glossary/GLOSSARY.md#glossary-context-builder), [Tool](../glossary/GLOSSARY.md#glossary-tool), [Tool Registry](../glossary/GLOSSARY.md#glossary-tool-registry), [Tool Calling](../glossary/GLOSSARY.md#glossary-tool-calling), [Event Bus](../glossary/GLOSSARY.md#glossary-event-bus), [Evidence](../glossary/GLOSSARY.md#glossary-evidence), [Suggested Actions](../glossary/GLOSSARY.md#glossary-suggested-actions), [Reasoning Trace](../glossary/GLOSSARY.md#glossary-reasoning-trace), and [Fixed-schema Generative UI](../glossary/GLOSSARY.md#glossary-fixed-schema-generative-ui).

## Change History

| Version | Date | Change |
| --- | --- | --- |
| 1.2 | 2026-08-12 | Added the P0-P9 production hard-gate roadmap and separated capability status from production certification |
| 1.1 | 2026-07-19 | Added status model, phase maturity and gates, architecture links, run-mode alignment, and enterprise classification |
| 1.0 | 2026-07 | Consolidated roadmap |

---


## Canonical Handbook Map

| Topic | Canonical document |
| --- | --- |
| Product vision | [PRODUCT_VISION.md](./PRODUCT_VISION.md) |
| Development phases | [DEVELOPMENT_PHASES.md](./DEVELOPMENT_PHASES.md) |
| Production completion gates | [PRODUCTION_COMPLETION_ROADMAP.md](../production-readiness/PRODUCTION_COMPLETION_ROADMAP.md) |
| Demo strategy | [DEMO_STRATEGY.md](./DEMO_STRATEGY.md) |
| Future roadmap | [FUTURE_ROADMAP.md](./FUTURE_ROADMAP.md) |
| Roadmap reference material | [APPENDIX.md](./APPENDIX.md) |
| Technical architecture | [TECHNICAL_MASTER_PLAN.md](../architecture/TECHNICAL_MASTER_PLAN.md) |
| Platform engineering | [DEVOPS_MASTER_PLAN.md](../platform/DEVOPS_MASTER_PLAN.md) |

## Phase Overview

Detailed scope, risks, dependencies, and acceptance criteria are canonical in [Development Phases](./DEVELOPMENT_PHASES.md).

Capability phases describe feature evolution and repository evidence. They do
not certify production readiness. Production progression is governed separately
by the sequential [P0-P9 Production Completion Roadmap](../production-readiness/PRODUCTION_COMPLETION_ROADMAP.md).


# Executive Summary

## Project Overview

Servexa Warranty AI là một nền tảng Agentic AI được xây dựng nhằm hỗ trợ toàn bộ quy trình xử lý bảo hành của doanh nghiệp, từ khâu tiếp nhận yêu cầu, kiểm tra điều kiện bảo hành, phân tích lỗi, truy xuất tri thức nội bộ, đề xuất phương án xử lý cho đến hỗ trợ kỹ thuật viên và nhân viên chăm sóc khách hàng đưa ra quyết định.

Thay vì phát triển một chatbot chỉ có khả năng trả lời câu hỏi, dự án hướng tới việc xây dựng một **AI Copilot** có khả năng cộng tác với con người trong các quy trình nghiệp vụ thực tế. AI không chỉ tạo ra câu trả lời bằng ngôn ngữ tự nhiên mà còn có thể truy xuất dữ liệu doanh nghiệp, giải thích căn cứ của từng kết luận, đề xuất các hành động phù hợp và cập nhật trạng thái của giao diện người dùng theo thời gian thực.

Định hướng lâu dài của dự án là trở thành một nền tảng Agentic AI có thể tích hợp vào hệ thống ERP hoặc Warranty Management System hiện có, thay vì chỉ là một ứng dụng chatbot độc lập.

---

## Vision

Dự án hướng tới việc xây dựng một nền tảng AI có khả năng trở thành "AI Warranty Specialist" cho doanh nghiệp.

AI sẽ hoạt động như một thành viên trong đội ngũ vận hành, có khả năng:

- hiểu toàn bộ ngữ cảnh của một hồ sơ bảo hành;
- truy xuất chính sách và tài liệu nội bộ;
- phân tích lịch sử các trường hợp tương tự;
- đề xuất quy trình xử lý;
- cộng tác với nhân viên trong suốt quá trình làm việc;
- chỉ thực hiện các hành động có rủi ro sau khi được con người phê duyệt.

Trong kiến trúc cuối cùng, AI không còn là một thành phần "Q&A" mà trở thành một **Agent có trạng thái (stateful agent)** có khả năng lập kế hoạch, suy luận và phối hợp với giao diện người dùng.

---

## Long-term Objectives

Roadmap của dự án được xây dựng theo hướng tiến hóa từng bước thay vì cố gắng triển khai toàn bộ Agentic AI ngay từ đầu.

Quá trình phát triển được chia thành nhiều giai đoạn, trong đó mỗi giai đoạn bổ sung thêm một năng lực mới cho hệ thống AI.

Quá trình tiến hóa này được thiết kế theo trình tự:

1. xây dựng khả năng hội thoại cơ bản với người dùng;
2. bổ sung khả năng truy xuất tri thức nội bộ;
3. đồng bộ trạng thái giữa Agent và giao diện;
4. đưa con người vào các quyết định quan trọng;
5. hiển thị quá trình suy luận;
6. cho phép AI điều khiển giao diện theo schema cố định;
7. mở rộng sang kiến trúc nhiều workflow chạy song song;
8. hỗ trợ dữ liệu đa phương tiện.

Mỗi giai đoạn đều có thể hoạt động độc lập, đồng thời tạo nền tảng cho giai đoạn tiếp theo.

---

## Product Positioning

Servexa Warranty AI không cạnh tranh với các chatbot AI phổ thông.

Sản phẩm được định vị là một **AI Decision Support Platform** dành riêng cho nghiệp vụ bảo hành và hậu mãi.

Khác với chatbot truyền thống, hệ thống tập trung vào:

- truy xuất dữ liệu doanh nghiệp;
- giảm thời gian xử lý hồ sơ;
- giảm sai sót trong việc áp dụng chính sách;
- hỗ trợ ra quyết định có căn cứ;
- chuẩn hóa quy trình vận hành.

AI được xem là một "copilot" hỗ trợ con người thay vì thay thế hoàn toàn con người.

---

## Core Design Principles

Toàn bộ roadmap của dự án được xây dựng dựa trên sáu nguyên tắc cốt lõi.

### AI phải luôn có căn cứ

Mọi câu trả lời quan trọng cần được hỗ trợ bởi bằng chứng từ chính sách bảo hành, tài liệu kỹ thuật hoặc các hồ sơ đã xử lý trước đó.

Hệ thống không hướng tới việc tạo ra các câu trả lời "có vẻ đúng" mà ưu tiên các câu trả lời có thể kiểm chứng và giải thích.

---

### AI luôn hoạt động trong ngữ cảnh

AI phải hiểu:

- hồ sơ hiện tại;
- sản phẩm đang xử lý;
- khách hàng;
- kỹ thuật viên;
- trạng thái của quy trình;
- các hành động đã thực hiện.

Điều này dẫn đến yêu cầu xây dựng Redis Shared State do Express kiểm soát, với local projection được chuyển tới giao diện qua API/SSE.

---

### AI cộng tác thay vì tự động hóa hoàn toàn

Những quyết định có rủi ro như:

- đổi sản phẩm;
- duyệt bảo hành;
- yêu cầu linh kiện;
- từ chối bảo hành;
- chuyển cấp xử lý;

không được AI tự ý thực hiện.

AI chỉ có quyền đề xuất.

Con người vẫn là người chịu trách nhiệm cuối cùng.

---

### AI phải minh bạch

Người dùng cần biết:

- AI lấy dữ liệu ở đâu;
- AI suy luận như thế nào;
- AI tự tin ở mức nào;
- AI đề xuất điều gì tiếp theo.

Đây là lý do roadmap bổ sung các tính năng:

- Evidence
- Suggested Actions
- Reasoning Trace

trước khi phát triển các khả năng phức tạp hơn.

---

### UI và AI phải hoạt động như một hệ thống thống nhất

Thay vì coi AI là một cửa sổ chat độc lập, dự án dùng một Business Context contract thống nhất. PostgreSQL qua Express là nguồn dữ liệu nghiệp vụ có thẩm quyền; Redis lưu Shared State điều phối.

FastAPI có thể sinh state proposal và fixed-schema UI; Express xác thực, cập nhật Redis và chuyển projection qua SSE. Giao diện chỉ gửi tương tác tới Express, không truyền ngữ cảnh trực tiếp cho FastAPI.

---

### Kiến trúc phải có khả năng mở rộng

Roadmap được thiết kế để có thể mở rộng từ một MVP hackathon lên kiến trúc production mà không cần thay đổi triết lý thiết kế.

Những thành phần như RAG, Shared State, Human-in-the-loop và Subgraphs đều được xây dựng theo hướng có thể phát triển dần mà không làm gián đoạn hệ thống hiện có.

---
