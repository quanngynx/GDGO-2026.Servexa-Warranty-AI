# Development Phases

> Canonical handbook. The preserved source material remains under `documents/`.

## Purpose

Define the approved capability evolution and delivery gates for Phases 0 through 8.

## Scope

Architecture evolution, development strategy, phase scope, dependencies, risks, and acceptance criteria.

## Dependencies

Each phase depends on the canonical architecture handbooks linked from its source material.

## Background

Background is provided by the linked master documentation.

## Architecture

The canonical architecture is defined in the related handbooks below.

## Design Principles

Apply the approved boundaries, ownership rules, and status classifications preserved in this handbook.

## Implementation

### Architecture Evolution

#### Evolution Philosophy

Kiến trúc của Servexa Warranty AI được phát triển theo hướng tiến hóa từng bước.

Thay vì xây dựng ngay một hệ thống Agentic AI hoàn chỉnh, dự án bổ sung dần các khả năng mới sau khi nền tảng của giai đoạn trước đã ổn định.

Điều này giúp giảm rủi ro kỹ thuật, đơn giản hóa việc kiểm thử và tạo ra các mốc phát triển có thể trình diễn được.

---

#### Evolution Stage 1 — Conversational AI

Giai đoạn đầu tập trung vào việc xây dựng một Agent có khả năng hội thoại với người dùng.

Ở giai đoạn này, AI đóng vai trò là một giao diện ngôn ngữ tự nhiên giúp truy cập vào hệ thống, nhưng chưa có khả năng thay đổi trạng thái của ứng dụng.

---

#### Evolution Stage 2 — Grounded AI

Sau khi Agent có thể hội thoại, hệ thống bổ sung khả năng truy xuất tri thức bằng RAG.

Mọi câu trả lời quan trọng đều được hỗ trợ bởi nguồn dữ liệu nội bộ nhằm giảm hiện tượng hallucination và tăng tính minh bạch.

---

#### Evolution Stage 3 — Stateful AI

Đây là bước chuyển quan trọng từ chatbot sang Agent.

Agent và giao diện bắt đầu dùng cùng một context contract/projection do Express cung cấp, cho phép AI hiểu ngữ cảnh hiện tại mà không cần người dùng nhập lại thông tin.

---

#### Evolution Stage 4 — Collaborative AI

AI bắt đầu tham gia vào quy trình làm việc thực tế thông qua việc đề xuất các hành động tiếp theo.

Những hành động quan trọng sẽ được chuyển sang bước Human-in-the-loop để người dùng xem xét trước khi thực thi.

---

#### Evolution Stage 5 — Explainable AI

Hệ thống bổ sung Reasoning Trace và Evidence nhằm giúp người dùng hiểu rõ vì sao AI đưa ra một kết luận nhất định.

Đây là yếu tố quan trọng để xây dựng niềm tin đối với các quyết định do AI hỗ trợ.

---

#### Evolution Stage 6 — Agent-driven Interface

Thay vì chỉ trả về văn bản, FastAPI có thể sinh các thành phần giao diện theo schema cố định; Express chuyển schema tới ứng dụng qua SSE để React render.

UI trở thành một phần của kết quả suy luận thay vì chỉ là nơi hiển thị hội thoại.

---

#### Evolution Stage 7 — Workflow Orchestration

Kiến trúc được mở rộng để nhiều workflow hoặc subgraph có thể hoạt động song song, phối hợp xử lý các tác vụ độc lập nhưng vẫn chia sẻ cùng ngữ cảnh.

---

#### Evolution Stage 8 — Multimodal Intelligence

Giai đoạn cuối mở rộng đầu vào của AI từ văn bản sang hình ảnh, tài liệu và các nguồn dữ liệu đa phương tiện khác, giúp AI hỗ trợ nhiều tình huống bảo hành thực tế hơn.

---

#### Horizon Classification

| Architecture Horizon | Capabilities |
| --- | --- |
| Current Decision | React, Express, FastAPI, LangGraph, PostgreSQL/pgvector, Redis, Redis Streams, Redis Pub/Sub, SSE, HITL |
| Planned Evolution | Internal HTTP migration, complete Express SSE Gateway, Shared State Adapter, Tool Resolver/Adapter, remaining state synchronization, Multimodal |
| Enterprise Vision | Multi-Agent, distributed runtime, Kubernetes, Kafka/NATS, MCP, OpenAI Agents SDK and enterprise integration network |

Planned and Enterprise capabilities must not be used to claim current production readiness.

---

### Development Strategy

#### Strategy Overview

Roadmap của Servexa Warranty AI tuân theo nguyên tắc **Capability-driven Development**.

Mỗi giai đoạn phát triển không chỉ bổ sung tính năng mới mà còn mở rộng năng lực cốt lõi của Agent. Điều này giúp hệ thống luôn ở trạng thái có thể chạy được, trình diễn được và dễ dàng mở rộng.

---

#### Guiding Principles

Toàn bộ quá trình phát triển được định hướng bởi các nguyên tắc sau:

- Xây dựng từ nền tảng đơn giản đến kiến trúc Agentic AI hoàn chỉnh.
- Mỗi phase phải tạo ra giá trị độc lập và có thể trình diễn.
- Chỉ bổ sung độ phức tạp khi đã có nhu cầu thực tế.
- Ưu tiên tính minh bạch và khả năng kiểm chứng hơn là tạo ra câu trả lời "ấn tượng".
- Luôn giữ con người trong vòng lặp đối với các quyết định có rủi ro.
- Thiết kế theo hướng mở rộng lên production mà không phải thay đổi kiến trúc cốt lõi.

---

#### Development Milestones

Roadmap được chia thành các phase theo thứ tự phụ thuộc năng lực:

1. Agentic Chat
2. Evidence + Suggested Actions
3. Shared State
4. Human-in-the-loop
5. Reasoning Trace
6. Fixed-schema Generative UI
7. Subgraphs Streaming
8. Multimodal

Mỗi phase đều kế thừa nền tảng của phase trước, hạn chế việc phải thiết kế lại kiến trúc và giúp nhóm phát triển kiểm soát tốt rủi ro kỹ thuật trong suốt vòng đời dự án.

Dependency chain bắt buộc:

`Phase 0 Foundation → Phase 1 Agentic Chat → Phase 2 Evidence/Suggested Actions → Phase 3 Shared State → Phase 4 HITL → Phase 5 Reasoning Trace → Phase 6 Fixed-schema Generative UI → Phase 7 LangGraph Subgraphs Streaming → Phase 8 Multimodal`.

Một phase chỉ bắt đầu khi acceptance criteria của phase ngay trước đã đạt. Các hạ tầng xuyên suốt từ Phase 0 gồm Express/FastAPI Internal HTTP, PostgreSQL/pgvector, PostgreSQL LangGraph checkpointer, Redis Shared State/Streams/Pub/Sub và Express SSE Gateway.

#### Phase Status Summary

| Phase | Architecture Horizon | Implementation Status |
| --- | --- | --- |
| 0 Foundation | Current Decision | Implemented |
| 1 Agentic Chat | Current Decision | Implemented |
| 2 Evidence + Suggested Actions | Current Decision | Partial |
| 3 Shared State | Current Decision | Partial |
| 4 Human-in-the-loop | Current Decision | Implemented |
| 5 Reasoning Trace | Current Decision | Partial |
| 6 Fixed-schema Generative UI | Current Decision | Partial |
| 7 Subgraphs Streaming | Current Decision | Partial |
| 8 Multimodal | Planned Evolution | Planned |

Implementation Status records repository evidence, not gate completion. A later capability may already exist in code, but it cannot be promoted as roadmap-complete until every predecessor exit criterion is satisfied; in particular, the implemented Phase 4 approval path remains release-gated by incomplete Phase 2–3 contracts and the Internal HTTP/SSE migration work.

### Phase 0 – Foundation

| Gate | Value |
| --- | --- |
| Architecture Horizon | Current Decision |
| Implementation Status | Implemented |
| Prerequisite | None |
| Exit criterion | React, Express and FastAPI boundaries, persistence, Redis and versioned contracts are runnable |
| Authoritative architecture | [System Overview](../architecture/SYSTEM_OVERVIEW.md#2-system-overview) |

#### Background

Trước khi xây dựng một Agentic AI hoàn chỉnh, dự án cần có một nền tảng đủ ổn định để hỗ trợ việc mở rộng sau này. Thay vì phát triển trực tiếp các khả năng phức tạp như Human-in-the-loop hay Multimodal, nhóm lựa chọn đầu tư vào kiến trúc nền nhằm giảm chi phí thay đổi về sau.

Phase Foundation tập trung vào việc chuẩn hóa kiến trúc, xác định ranh giới giữa các thành phần, xây dựng hạ tầng AI và lựa chọn các công nghệ cốt lõi. Đây là giai đoạn ít tạo ra giá trị trực tiếp cho người dùng cuối nhưng quyết định khả năng mở rộng của toàn bộ hệ thống.

Một nguyên tắc xuyên suốt trong giai đoạn này là **AI phải được thiết kế như một dịch vụ độc lập** thay vì được nhúng trực tiếp vào backend nghiệp vụ. Điều này giúp AI có thể được nâng cấp, thay đổi mô hình hoặc mở rộng sang nhiều workflow mà không ảnh hưởng đến các dịch vụ nghiệp vụ hiện có.

---

#### Objectives

Phase Foundation hướng tới các mục tiêu sau:

- Xây dựng kiến trúc tổng thể của Servexa Warranty AI.
- Thiết lập React + TypeScript, Express.js (Node.js) và FastAPI (Python) thành các service boundary rõ ràng.
- Chọn LangGraph làm workflow engine và PostgreSQL làm LangGraph checkpointer.
- Chuẩn hóa React → Express qua HTTPS/SSE và Express → FastAPI qua Internal HTTP.
- Chuẩn bị hạ tầng cho Retrieval-Augmented Generation (RAG).
- Chuẩn bị PostgreSQL + pgvector, Redis cache/Shared State, Redis Streams event bus và Redis Pub/Sub notification.
- Chuẩn bị contract cho streaming, workflow, event envelope, Tool Registry và Copilot Panel.

---

#### Scope

Trong phạm vi Phase Foundation, hệ thống cần hoàn thành các thành phần nền tảng sau:

##### Frontend

- React + TypeScript application shell.
- Copilot Panel và Chat Interface skeleton.
- SSE client/event processor contract.
- Local Shared State projection contract.
- Frontend không chứa AI orchestration hoặc business logic.

##### Backend

- Express Gateway/Business API skeleton.
- Authentication và Authorization boundary.
- Workflow, CRUD và Upload API contracts.
- SSE Streaming Gateway contract.
- Internal HTTP client contract cho FastAPI.
- PostgreSQL/Redis connectivity, logging và error envelope.

##### AI Service

- FastAPI service skeleton.
- LangGraph graph/state contracts.
- Context Builder và Tool Registry contracts.
- PostgreSQL checkpointer configuration.
- RAG và fixed-schema UI contracts.

##### Knowledge Layer

- Document Storage.
- Embedding pipeline contract.
- PostgreSQL + pgvector schema/migration.
- Metadata Management.

---

#### Deliverables

Sau khi kết thúc Phase Foundation, dự án phải có:

- service skeleton và health check cho React, Express và FastAPI;
- contract test cho Internal HTTP và versioned Event Envelope;
- schema/migration cho PostgreSQL, pgvector và LangGraph checkpoint;
- Redis connectivity cho Shared State, Streams và Pub/Sub;
- SSE smoke path qua Express Gateway;
- Tool Registry, RAG và conversation contracts sẵn sàng cho các phase hành vi tiếp theo.

Đây là điều kiện tiên quyết để triển khai Agentic Chat.

---

#### Dependencies

Các thành phần phụ thuộc bao gồm:

- AI Model Provider.
- Embedding Model.
- PostgreSQL + pgvector.
- Redis.
- PostgreSQL.
- Backend API.
- Authentication Service.

---

#### Risks

Nếu kiến trúc nền không được thiết kế tốt, toàn bộ roadmap sau này sẽ gặp các vấn đề như:

- AI phụ thuộc chặt vào Backend.
- Khó mở rộng sang nhiều Agent.
- Không hỗ trợ streaming.
- Không hỗ trợ workflow phức tạp.
- Khó bổ sung Human Approval.
- Khó tích hợp Generative UI.

Do đó, Phase Foundation được xem là khoản đầu tư cho toàn bộ vòng đời của dự án.

---

#### Acceptance Criteria

Phase Foundation được xem là hoàn thành khi:

- AI Service hoạt động độc lập.
- Frontend chỉ có thể gọi Express; direct frontend → FastAPI bị cấm.
- Express sở hữu authentication, authorization, business API, workflow API, upload và SSE gateway.
- FastAPI sở hữu LangGraph, Context Builder, RAG, Tool orchestration, reasoning và UI generation.
- Internal HTTP, Redis Streams, Redis Pub/Sub, SSE và Event Envelope có contract test/smoke test.
- PostgreSQL là business source of truth; pgvector và PostgreSQL LangGraph checkpointer đã được cấu hình.

---

### Phase 1 – Agentic Chat

| Gate | Value |
| --- | --- |
| Architecture Horizon | Current Decision |
| Implementation Status | Implemented |
| Prerequisite | Phase 0 acceptance criteria |
| Exit criterion | Persistent conversation, usable streaming response and read-only Tool path |
| Authoritative architecture | [Agentic AI Architecture](../architecture/AI_RUNTIME.md#3-agentic-ai-architecture) |

#### Background

Agentic Chat là bước chuyển đổi đầu tiên từ một chatbot truyền thống sang một AI Copilot có khả năng cộng tác với người dùng.

Mục tiêu của phase này không phải tạo ra một chatbot thông minh nhất mà là xây dựng một Agent có thể duy trì hội thoại, ghi nhớ ngữ cảnh của phiên làm việc và giao tiếp với các thành phần khác trong hệ thống.

Trong giai đoạn này, AI chủ yếu trả lời bằng văn bản và chưa trực tiếp điều khiển giao diện hay thực hiện các hành động nghiệp vụ.

---

#### Objectives

Phase Agentic Chat hướng tới việc xây dựng:

- hội thoại theo thời gian thực;
- streaming response;
- conversation history;
- session management;
- tool calling cơ bản;
- memory trong phạm vi phiên làm việc.

Người dùng có thể đặt câu hỏi liên quan đến bảo hành và nhận phản hồi liên tục thay vì phải chờ AI sinh toàn bộ câu trả lời.

---

#### Functional Scope

Các chức năng chính bao gồm:

##### Streaming Conversation

FastAPI phát workflow event vào Redis Streams; Express Streaming Gateway xác thực/lọc và phản hồi từng phần tới React bằng SSE. Frontend không kết nối trực tiếp FastAPI.

---

##### Conversation Memory

Agent ghi nhớ nội dung của phiên hội thoại hiện tại, giúp giảm việc người dùng phải lặp lại thông tin.

---

##### Basic Tool Calling

Agent có thể gọi các công cụ nội bộ như:

- tra cứu sản phẩm;
- kiểm tra serial;
- kiểm tra trạng thái bảo hành;
- tìm kiếm tài liệu.

Ở giai đoạn này, tool chỉ được sử dụng để hỗ trợ trả lời và chưa tạo ra thay đổi trong hệ thống.

Mọi business-data tool được FastAPI điều phối qua Internal HTTP tới Express; Express thực hiện authentication, authorization và truy vấn dữ liệu.

---

##### Conversation Persistence

Lịch sử hội thoại được lưu để người dùng có thể tiếp tục phiên làm việc mà không mất ngữ cảnh.

---

#### Deliverables

Kết thúc Phase 1, hệ thống cần đạt được:

- Chat UI hoàn chỉnh.
- Streaming ổn định.
- Session Management.
- Conversation History.
- Tool Calling cơ bản.
- Prompt Management.
- Basic Agent Runtime.

---

#### Limitations

Phase này **chưa giải quyết**:

- AI không có Evidence.
- AI chưa giải thích lý do.
- AI chưa hiểu Shared State.
- AI chưa điều khiển UI.
- AI chưa đề xuất hành động.
- AI chưa cần Human Approval.

Những khả năng này sẽ được bổ sung ở các phase tiếp theo.

---

#### Acceptance Criteria

Agentic Chat được xem là hoàn thành khi:

- người dùng có thể trò chuyện liên tục;
- phản hồi được stream theo thời gian thực;
- toàn bộ browser streaming đi qua Express SSE Gateway;
- AI ghi nhớ cuộc hội thoại hiện tại;
- có thể gọi các tool cơ bản qua Express Business API.

---

### Phase 2 – Evidence + Suggested Actions

| Gate | Value |
| --- | --- |
| Architecture Horizon | Current Decision |
| Implementation Status | Partial |
| Prerequisite | Phase 1 acceptance criteria and pgvector retrieval foundation |
| Exit criterion | Important answers expose validated Evidence, citations, confidence and non-executing Suggested Actions |
| Authoritative architecture | [RAG Architecture](../architecture/AI_RUNTIME.md#5-rag-architecture) |

#### Background

Một trong những hạn chế lớn nhất của chatbot truyền thống là thiếu khả năng chứng minh cho câu trả lời của mình. Trong môi trường doanh nghiệp, đặc biệt là lĩnh vực bảo hành, việc AI trả lời mà không có căn cứ là không thể chấp nhận.

Do đó, sau khi Agentic Chat ổn định, bước tiếp theo là bổ sung khả năng truy xuất dữ liệu nội bộ và trình bày bằng chứng đi kèm với câu trả lời.

Song song với đó, AI cũng bắt đầu đề xuất các hành động phù hợp dựa trên ngữ cảnh hiện tại.

---

#### Objectives

Phase này tập trung vào hai năng lực chính:

- Grounded Response.
- Decision Assistance.

AI không chỉ trả lời mà còn:

- chỉ ra nguồn dữ liệu;
- giải thích căn cứ;
- đề xuất bước tiếp theo.

---

#### Evidence Layer

AI sử dụng RAG để truy xuất:

- Warranty Policy.
- Repair Manual.
- SOP.
- Knowledge Base.
- Internal Documentation.

Similar Repair Cases là business data và phải được lấy qua Express Business API. Chỉ case đã khử định danh, tuyển chọn và xuất bản thành knowledge document mới được index trong pgvector.

Kết quả truy xuất được hiển thị trực tiếp trên giao diện dưới dạng danh sách nguồn tham khảo, giúp người dùng kiểm chứng câu trả lời.

---

#### Suggested Actions

Sau khi phân tích ngữ cảnh, AI tạo ra danh sách các hành động phù hợp.

Ví dụ:

- Tạo Repair Task.
- Chuyển kỹ thuật viên.
- Kiểm tra tồn kho.
- Yêu cầu thay linh kiện.
- Escalate lên cấp cao hơn.

Các hành động này chỉ mang tính đề xuất và chưa được thực thi tự động.

---

#### Deliverables

Phase này cần hoàn thành:

- RAG Integration.
- Evidence Panel.
- Source Citation.
- Suggested Actions Card.
- Confidence Score.
- Retrieval Pipeline.

---

#### Dependencies

Evidence phụ thuộc trực tiếp vào:

- Knowledge Base.
- Embedding Pipeline.
- PostgreSQL + pgvector.
- Metadata.
- AI Retrieval Layer.

---

#### Acceptance Criteria

Phase được xem là hoàn thành khi:

- mọi câu trả lời quan trọng đều có Evidence;
- AI hiển thị nguồn tham khảo;
- AI đề xuất các hành động tiếp theo;
- người dùng có thể kiểm chứng toàn bộ kết quả.

---

### Phase 3 – Shared State

| Gate | Value |
| --- | --- |
| Architecture Horizon | Current Decision |
| Implementation Status | Partial |
| Prerequisite | Phase 2 contracts and Express authorization boundary |
| Exit criterion | Versioned authorized projection and patch flow work without treating Redis as business source of truth |
| Authoritative architecture | [Shared State Architecture](../architecture/SHARED_STATE.md#8-shared-state-architecture) |

#### Background

Đây là bước chuyển quan trọng nhất trong quá trình tiến hóa của dự án. Sau hai phase đầu, AI vẫn hoạt động như một chatbot nâng cao, chỉ biết những gì người dùng nhập vào.

Shared State cung cấp Redis coordination context thống nhất. React chỉ giữ local projection qua Express API/SSE; PostgreSQL qua Express vẫn là business source of truth và FastAPI không trực tiếp sở hữu business state.

Điều này giúp AI hiểu được toàn bộ bối cảnh làm việc mà không cần người dùng nhập lại thông tin.

---

#### Objectives

Shared State hướng tới:

- đồng bộ projection giữa React, Express và FastAPI;
- loại bỏ việc hỏi lại thông tin đã có;
- duy trì ngữ cảnh nghiệp vụ theo thời gian thực;
- chuẩn bị nền tảng cho Human-in-the-loop và Generative UI.

---

#### Shared Business Context

Các đối tượng trạng thái được đồng bộ bao gồm:

- Current Repair Case.
- Warranty Eligibility Result từ Express.
- Diagnosis Draft.
- Selected Product.
- Selected Part.
- Evidence Sources.
- Recommended Actions.
- Technician Context.
- Customer Context.

Context Builder nhận cùng contract projection mà Express cung cấp cho giao diện; khi cần dữ liệu nghiệp vụ mới nhất, FastAPI gọi Express Business API.

---

#### State Synchronization

Luồng dữ liệu được chuẩn hóa qua Express:

1. Người dùng thao tác trên giao diện.
2. UI gửi request tới Express.
3. Express xác thực, cập nhật PostgreSQL hoặc Redis Shared State tùy loại dữ liệu.
4. Express gọi FastAPI qua Internal HTTP; FastAPI trả state proposal/workflow output.
5. Express cập nhật Redis, phát Redis Streams event và chuyển projection qua SSE.
6. UI xử lý event và render lại.

Nhờ đó, AI không còn hoạt động như một hộp đen mà trở thành một thành phần tham gia trực tiếp vào quy trình nghiệp vụ.

---

#### Business Value

Shared State giúp:

- giảm số lần AI hỏi lại thông tin;
- giảm thao tác nhập liệu;
- duy trì ngữ cảnh giữa nhiều bước xử lý;
- chuẩn bị nền tảng cho các workflow phức tạp hơn.

Đây cũng là tiền đề để triển khai Human-in-the-loop, Reasoning Trace và Generative UI trong các phase tiếp theo.

---

#### Deliverables

Kết thúc Phase 3, hệ thống cần có:

- Shared State Store.
- State Synchronization Protocol.
- Context Injection.
- State Patch Mechanism.
- Agent Context API.
- UI Auto Re-render.

---

#### Acceptance Criteria

Phase Shared State được xem là hoàn thành khi:

- Agent và UI nhận cùng một projection đã được Express phân quyền.
- AI không cần hỏi lại dữ liệu đã có trên giao diện.
- Mọi cập nhật từ AI đều phản ánh ngay trên UI.
- Redis Shared State là nguồn ngữ cảnh điều phối; PostgreSQL qua Express là nguồn dữ liệu nghiệp vụ có thẩm quyền.

### Phase 4 – Human-in-the-loop

| Gate | Value |
| --- | --- |
| Architecture Horizon | Current Decision |
| Implementation Status | Implemented |
| Prerequisite | Suggested Actions, authorization, audit persistence and LangGraph checkpoint identity |
| Exit criterion | Approval state machine, authorization, business execution, audit and resume are verified end to end |
| Authoritative architecture | [Human-in-the-loop](../architecture/REASONING.md#10-human-in-the-loop-hitl) |

#### Background

Khi Agent bắt đầu tham gia sâu hơn vào quy trình nghiệp vụ, khả năng chỉ đưa ra câu trả lời không còn đủ. Ở thời điểm này, AI đã có thể hiểu ngữ cảnh, truy xuất tri thức và đề xuất các hành động phù hợp. Tuy nhiên, trong lĩnh vực bảo hành, nhiều hành động có ảnh hưởng trực tiếp đến quyền lợi của khách hàng, chi phí của doanh nghiệp hoặc trách nhiệm của kỹ thuật viên. Việc cho phép AI tự động thực thi các hành động này sẽ tạo ra rủi ro rất lớn.

Vì vậy, Human-in-the-loop (HITL) được đưa vào như một nguyên tắc thiết kế cốt lõi của hệ thống. AI đóng vai trò là người đề xuất và hỗ trợ phân tích, trong khi con người vẫn là người đưa ra quyết định cuối cùng đối với các nghiệp vụ quan trọng.

Phase này đánh dấu sự chuyển đổi từ một Agent chỉ hỗ trợ tư vấn sang một Agent có khả năng tham gia trực tiếp vào quy trình vận hành nhưng luôn hoạt động trong phạm vi được kiểm soát.

---

#### Objectives

Human-in-the-loop hướng tới các mục tiêu sau:

- Đưa con người vào các bước quyết định quan trọng.
- Phân tách rõ giữa "AI Recommendation" và "Business Execution".
- Xây dựng cơ chế phê duyệt trước khi Express thực hiện business action do AI đề xuất.
- Đảm bảo khả năng kiểm toán toàn bộ quá trình ra quyết định.
- Chuẩn bị nền tảng cho Agent Workflow ở các phase tiếp theo.

---

#### Business Scenarios

Không phải mọi hành động đều cần sự phê duyệt của con người. AI có thể tự động yêu cầu read-only tool; Express vẫn xác thực, phân quyền và thực thi truy vấn. Các hành động làm thay đổi trạng thái nghiệp vụ cần được kiểm soát.

Ví dụ:

##### Warranty Approval

AI phân tích:

- điều kiện bảo hành;
- lịch sử sửa chữa;
- chính sách áp dụng;
- bằng chứng liên quan.

Sau đó AI đề xuất:

> "Thiết bị đủ điều kiện bảo hành."

Nhưng quyết định **phê duyệt bảo hành** vẫn thuộc về nhân viên.

---

##### Warranty Rejection

AI có thể phát hiện:

- hết thời hạn bảo hành;
- dấu hiệu can thiệp trái phép;
- lỗi nằm ngoài phạm vi chính sách.

AI sẽ trình bày:

- căn cứ;
- điều khoản liên quan;
- mức độ tự tin.

Người dùng quyết định có từ chối yêu cầu hay không.

---

##### Technician Assignment

AI có thể đề xuất kỹ thuật viên phù hợp dựa trên:

- chuyên môn;
- khu vực;
- khối lượng công việc;
- lịch sử xử lý.

Việc phân công cuối cùng vẫn được người điều phối xác nhận.

---

##### Spare Part Recommendation

AI có thể đề xuất:

- linh kiện cần thay;
- số lượng;
- mức độ ưu tiên.

Nhân viên quyết định có tạo yêu cầu xuất kho hay không.

---

#### Human Approval Workflow

Mọi hành động có rủi ro đều tuân theo một quy trình thống nhất.

##### Step 1 — AI Analysis

AI thu thập:

- Shared State;
- Evidence;
- Knowledge Base;
- Business Rule Results từ Express.

Sau đó sinh ra một đề xuất.

---

##### Step 2 — Recommendation

Đề xuất được hiển thị dưới dạng một Action Card bao gồm:

- hành động được đề xuất;
- lý do;
- mức độ tự tin;
- bằng chứng hỗ trợ;
- tác động dự kiến.

Trước khi chờ người dùng, LangGraph phát `workflow.interrupted` và ghi checkpoint bền vững vào PostgreSQL.

---

##### Step 3 — User Review

Người dùng xem xét:

- căn cứ;
- dữ liệu đầu vào;
- lý do ngắn gọn gắn với action và evidence.

Full structured Reasoning Trace và Alternative Options được bổ sung ở Phase 5.

---

##### Step 4 — Approval

Người dùng có thể:

- Approve.
- Reject.
- Edit.
- Request More Information.

Mọi quyết định được gửi tới Express Approval API để authentication, authorization và audit trước khi Express yêu cầu FastAPI resume từ PostgreSQL checkpoint.

---

##### Step 5 — Execution

Chỉ sau khi được phê duyệt, Express mới xác thực quyền lần cuối, áp dụng business rule và thực hiện transaction trong PostgreSQL.

Agent không có quyền thực thi trực tiếp.

---

#### UI Experience

Copilot Panel sẽ hiển thị rõ ràng các trạng thái:

- Pending Approval
- Approved
- Rejected
- Executed

Các Action Card được thiết kế để người dùng dễ dàng hiểu:

- AI đề xuất điều gì.
- Tại sao AI đề xuất.
- Nếu đồng ý thì điều gì sẽ xảy ra.

Mọi quyết định đều có thể truy vết.

---

#### Business Value

Human-in-the-loop mang lại nhiều giá trị:

- Giảm rủi ro khi sử dụng AI.
- Tăng mức độ tin tưởng của người dùng.
- Đảm bảo trách nhiệm pháp lý.
- Chuẩn hóa quy trình phê duyệt.
- Giúp AI hoạt động như một cộng sự thay vì một hệ thống tự động hóa.

---

#### Deliverables

Phase này cần hoàn thành:

- Human Approval Workflow.
- Approval Action Cards.
- Pending Action Queue.
- Approval History.
- Decision Audit Log.
- Action Execution Pipeline.
- Permission-aware Tool Invocation.

---

#### Dependencies

Human-in-the-loop phụ thuộc vào:

- Agentic Chat.
- Evidence.
- Suggested Actions.
- Shared State.
- Authentication.
- Authorization.
- LangGraph interrupt/resume.
- PostgreSQL LangGraph checkpointer.
- Redis Streams và Express SSE Gateway.
- Internal HTTP giữa Express và FastAPI.

---

#### Risks

Nếu bỏ qua Human-in-the-loop, hệ thống sẽ đối mặt với nhiều rủi ro:

- AI thực hiện sai hành động.
- Thiếu khả năng kiểm toán.
- Người dùng mất niềm tin.
- Khó triển khai trong môi trường doanh nghiệp.
- Không đáp ứng các yêu cầu về kiểm soát nội bộ.

---

#### Acceptance Criteria

Phase Human-in-the-loop được xem là hoàn thành khi:

- Express không thực hiện action quan trọng do AI đề xuất nếu chưa được phê duyệt; AI không trực tiếp thực thi business action.
- Người dùng có thể xem toàn bộ căn cứ trước khi đưa ra quyết định.
- Mọi hành động đều được ghi lại đầy đủ.
- Quy trình phê duyệt có thể mở rộng sang nhiều loại nghiệp vụ khác nhau.

---

### Phase 5 – Reasoning Trace

| Gate | Value |
| --- | --- |
| Architecture Horizon | Current Decision |
| Implementation Status | Partial |
| Prerequisite | Evidence, HITL and Express Business Rule Results |
| Exit criterion | Important recommendations expose a complete safe structured trace without Chain of Thought |
| Authoritative architecture | [Reasoning Trace](../architecture/REASONING.md#11-reasoning-trace) |

#### Background

Sau khi AI có thể đưa ra đề xuất và con người tham gia phê duyệt, câu hỏi tiếp theo luôn xuất hiện:

> "Tại sao AI lại đưa ra kết luận này?"

Nếu AI chỉ trả về kết quả cuối cùng, người dùng rất khó đánh giá mức độ hợp lý của đề xuất. Trong môi trường doanh nghiệp, đặc biệt là xử lý bảo hành, khả năng giải thích là yếu tố quyết định mức độ chấp nhận của người dùng.

Reasoning Trace được bổ sung để giúp AI trình bày quá trình suy luận ở mức phù hợp với người dùng, không nhằm hiển thị toàn bộ suy luận nội bộ của mô hình mà cung cấp một bản tóm tắt có cấu trúc về cách AI đi đến kết luận.

---

#### Objectives

Phase này hướng tới các mục tiêu:

- Tăng tính minh bạch của AI.
- Giúp người dùng hiểu quá trình phân tích.
- Hỗ trợ việc kiểm chứng và phản biện.
- Tăng độ tin cậy đối với các đề xuất.
- Cung cấp nền tảng cho việc audit và debugging.

---

#### Explainable Decision Flow

Một kết luận của AI không còn chỉ là một đoạn văn bản.

Mỗi quyết định sẽ được mô tả theo chuỗi:

1. Input Context.
2. Evidence Collection.
3. Policy Matching.
4. Business Rule Result từ Express.
5. Alternative Analysis.
6. Final Recommendation.

Người dùng có thể quan sát từng bước mà không cần hiểu cách hoạt động bên trong của mô hình ngôn ngữ.

---

#### Reasoning Components

##### Context Summary

AI tóm tắt các dữ liệu đã sử dụng:

- thông tin khách hàng;
- sản phẩm;
- lịch sử bảo hành;
- trạng thái hiện tại;
- dữ liệu từ Shared State.

---

##### Evidence Summary

Danh sách các nguồn tri thức được sử dụng:

- Warranty Policy.
- Repair Manual.
- Knowledge Base.
- Previous Cases.
- Technical Documentation.

---

##### Rule Result Explanation

Express Business Rule Engine đánh giá quy tắc; AI trình bày kết quả đã áp dụng.

Ví dụ:

- thời hạn bảo hành còn hiệu lực;
- sản phẩm thuộc chương trình đổi mới;
- điều kiện loại trừ không được kích hoạt.

---

##### Confidence Assessment

AI thể hiện mức độ tự tin của kết luận và giải thích nguyên nhân.

Nếu thiếu dữ liệu hoặc tồn tại mâu thuẫn giữa các nguồn, hệ thống sẽ chủ động thông báo thay vì đưa ra kết luận chắc chắn.

---

##### Alternative Options

Trong nhiều tình huống có hơn một phương án xử lý.

AI sẽ liệt kê:

- phương án đề xuất;
- các lựa chọn thay thế;
- ưu điểm và hạn chế của từng phương án.

Điều này giúp người dùng có thêm cơ sở trước khi phê duyệt.

---

#### UI Experience

Reasoning Trace được hiển thị dưới dạng một panel có thể mở rộng, bao gồm:

- Context Summary.
- Evidence.
- Business Rule Result.
- Decision Path.
- Confidence.
- Alternative Actions.

Người dùng có thể xem nhanh hoặc mở rộng từng bước khi cần.

Thiết kế này giúp giao diện vẫn gọn gàng nhưng vẫn đảm bảo tính minh bạch.

---

#### Business Value

Reasoning Trace giúp:

- tăng niềm tin đối với AI;
- giảm thời gian giải thích giữa các bộ phận;
- hỗ trợ đào tạo nhân viên mới;
- chuẩn hóa quy trình ra quyết định;
- cung cấp dữ liệu cho việc kiểm toán và cải tiến mô hình.

Đây cũng là nền tảng để mở rộng sang các workflow phức tạp hơn, nơi nhiều Agent cùng tham gia xử lý một hồ sơ.

---

#### Deliverables

Phase này cần hoàn thành:

- Reasoning Trace Panel.
- Context Summary Generator.
- Evidence Timeline.
- Business Rule Result Summary.
- Confidence Explanation.
- Alternative Recommendation View.
- Decision Timeline.

---

#### Dependencies

Reasoning Trace phụ thuộc vào:

- Evidence Layer.
- Shared State.
- Human-in-the-loop.
- Retrieval Pipeline.
- Express Business Rule Engine.

---

#### Risks

Nếu không có Reasoning Trace:

- Người dùng khó tin tưởng AI.
- Việc phê duyệt mất nhiều thời gian hơn.
- Khó debug khi AI đưa ra kết luận sai.
- Không đáp ứng yêu cầu minh bạch trong môi trường doanh nghiệp.

---

#### Acceptance Criteria

Phase Reasoning Trace được xem là hoàn thành khi:

- Mọi đề xuất quan trọng đều có phần giải thích rõ ràng.
- Người dùng có thể xem được dữ liệu, quy tắc và bằng chứng mà AI đã sử dụng.
- Hệ thống thể hiện mức độ tự tin và các phương án thay thế.
- Reasoning được trình bày dưới dạng có cấu trúc, dễ hiểu và không làm lộ quá trình suy luận nội bộ của mô hình.

### Phase 6 – Fixed-schema Generative UI

| Gate | Value |
| --- | --- |
| Architecture Horizon | Current Decision |
| Implementation Status | Partial |
| Prerequisite | Shared State, Evidence, Reasoning Trace, HITL and SSE delivery |
| Exit criterion | Registered components render compatible schema `1.0` and reject unsupported major versions safely |
| Authoritative architecture | [Fixed-schema Generative UI](../architecture/GENERATIVE_UI.md#12-fixed-schema-generative-ui) |

#### Background

Sau khi AI đã có khả năng hiểu ngữ cảnh, truy xuất tri thức, đề xuất hành động và giải thích quá trình suy luận, giới hạn lớn nhất còn lại nằm ở cách tương tác với người dùng. Nếu mọi kết quả vẫn chỉ được trả về dưới dạng văn bản, người dùng sẽ phải tự diễn giải, tự tìm kiếm thông tin liên quan và thực hiện các thao tác tiếp theo trên giao diện. Điều này làm giảm đáng kể hiệu quả của một AI Copilot.

Phase này đánh dấu sự chuyển đổi từ **Text-centric AI** sang **Interface-aware AI**. Thay vì chỉ sinh ra nội dung hội thoại, AI có khả năng sinh ra các thành phần giao diện theo một schema cố định để frontend có thể render trực tiếp. AI không còn "mô tả" giao diện mà "điều khiển" giao diện thông qua dữ liệu có cấu trúc.

Việc sử dụng Fixed-schema Generative UI thay vì cho phép AI sinh HTML hoặc JSX trực tiếp giúp đảm bảo tính ổn định, bảo mật và khả năng kiểm soát. Frontend luôn là thành phần chịu trách nhiệm render, còn AI chỉ quyết định **"render cái gì"** chứ không quyết định **"render như thế nào"**.

---

#### Objectives

Phase này hướng tới các mục tiêu sau:

- Chuyển đổi từ phản hồi dạng văn bản sang phản hồi có cấu trúc.
- Cho phép AI tạo các UI Component thông qua schema thống nhất.
- Giảm thao tác thủ công của người dùng sau mỗi câu trả lời.
- Đồng bộ chặt chẽ giữa Shared State và giao diện.
- Chuẩn bị nền tảng cho Agent-driven Interface trong các workflow phức tạp.

---

#### Design Philosophy

Generative UI không nhằm thay thế frontend.

Frontend vẫn chịu trách nhiệm:

- thiết kế giao diện;
- quản lý component;
- animation;
- responsive;
- accessibility.

AI chỉ quyết định:

- component nào cần hiển thị;
- thứ tự hiển thị;
- dữ liệu truyền vào component;
- trạng thái của component.

Điều này giúp frontend luôn kiểm soát được trải nghiệm người dùng trong khi AI chỉ đóng vai trò điều phối.

---

#### Fixed-schema Approach

Thay vì sinh HTML hoặc React Component, AI trả về một schema có cấu trúc.

Ví dụ, Agent có thể yêu cầu frontend hiển thị:

- Evidence Card.
- Suggested Action Card.
- Warranty Summary.
- Product Information Panel.
- Repair Timeline.
- Approval Request.
- Confirmation Dialog.
- Knowledge Source List.
- Warning Banner.
- Progress Indicator.

Frontend chỉ cần ánh xạ schema này tới các component đã được xây dựng sẵn.

---

#### Dynamic UI Composition

Một phản hồi của AI có thể bao gồm nhiều component khác nhau.

Ví dụ:

1. Tóm tắt tình trạng bảo hành.
2. Danh sách bằng chứng.
3. Các điều khoản chính sách liên quan.
4. Danh sách hành động đề xuất.
5. Nút yêu cầu phê duyệt.
6. Danh sách hồ sơ tương tự.

Tất cả được render tự động mà không cần frontend viết logic riêng cho từng trường hợp.

---

#### Shared State Integration

Generative UI không hoạt động độc lập.

Mọi component đều được liên kết với Shared State.

Khi FastAPI phát state proposal:

- trạng thái hồ sơ;
- mức độ tự tin;
- danh sách evidence;
- suggested actions;

Express cập nhật Redis Shared State và gửi projection qua SSE; giao diện tự động cập nhật mà không cần người dùng tải lại. FastAPI không cập nhật business state trực tiếp.

---

#### User Experience

Người dùng sẽ không còn đọc một đoạn văn dài rồi tự tìm nút để thao tác.

Thay vào đó, AI trực tiếp tạo ra:

- bảng thông tin;
- timeline;
- card;
- cảnh báo;
- form;
- danh sách hành động.

Điều này giúp giảm đáng kể số bước thao tác và biến cuộc hội thoại thành một quy trình làm việc thực sự.

---

#### Business Value

Fixed-schema Generative UI mang lại nhiều lợi ích:

- Chuẩn hóa trải nghiệm người dùng.
- Giảm độ phức tạp của frontend.
- Tăng tốc quá trình ra quyết định.
- Cho phép AI và UI hoạt động như một hệ thống thống nhất.
- Đảm bảo mọi thành phần sinh ra đều có thể kiểm soát và kiểm thử.

---

#### Deliverables

Phase này cần hoàn thành:

- Fixed UI Schema Specification.
- Component Registry.
- UI Renderer.
- Dynamic Layout Engine.
- Agent UI Response Protocol.
- State-aware Component Binding.
- Schema Validation Layer.

---

#### Dependencies

Generative UI phụ thuộc vào:

- Shared State.
- Human-in-the-loop.
- Reasoning Trace.
- Evidence Layer.
- Suggested Actions.
- Streaming Infrastructure.

---

#### Risks

Nếu để AI sinh giao diện tự do:

- khó kiểm soát bảo mật;
- không đảm bảo tính nhất quán;
- frontend khó bảo trì;
- tăng nguy cơ sinh giao diện không hợp lệ.

Do đó, toàn bộ giao diện được giới hạn trong một tập component đã được định nghĩa trước.

---

#### Acceptance Criteria

Phase Fixed-schema Generative UI được xem là hoàn thành khi:

- AI có thể sinh giao diện thông qua schema thống nhất.
- Các vùng Generative UI render dựa trên schema; app shell và màn hình nghiệp vụ cố định vẫn do Frontend kiểm soát.
- Không cần viết UI riêng cho từng workflow mới.
- Shared State và UI luôn được đồng bộ.
- Tất cả component đều có thể tái sử dụng.

---

### Phase 7 – Subgraphs Streaming

| Gate | Value |
| --- | --- |
| Architecture Horizon | Current Decision |
| Implementation Status | Partial |
| Prerequisite | LangGraph runtime, Redis Streams, Workflow Coordinator and Express SSE Gateway |
| Exit criterion | Parallel branches preserve typed state, isolate failures and stream partial results through Express |
| Authoritative architecture | [Subgraphs Streaming](../architecture/AI_RUNTIME.md#13-subgraphs-streaming) |

#### Background

Khi Agent ngày càng đảm nhận nhiều nhiệm vụ, việc xử lý toàn bộ quy trình bằng một workflow tuyến tính sẽ nhanh chóng trở thành nút thắt về hiệu năng và khả năng mở rộng. Một yêu cầu bảo hành có thể đồng thời cần kiểm tra chính sách, truy xuất tài liệu kỹ thuật, phân tích lịch sử sửa chữa, đánh giá tồn kho và xác định kỹ thuật viên phù hợp. Nếu các tác vụ này được thực hiện tuần tự, thời gian phản hồi sẽ tăng đáng kể.

Phase này mở rộng LangGraph bằng **Subgraphs Streaming**: các subgraph trong cùng FastAPI runtime có typed graph state và dependency edges rõ ràng. Redis Streams phục vụ event liên dịch vụ/streaming, không thay thế LangGraph control flow.

Đây là bước chuyển từ một Agent đơn lẻ sang một hệ thống có khả năng điều phối nhiều tiến trình AI một cách linh hoạt.

---

#### Objectives

Phase này hướng tới:

- Chia nhỏ workflow thành nhiều subgraph độc lập.
- Thực thi song song các tác vụ không phụ thuộc nhau.
- Stream kết quả từng phần ngay khi hoàn thành.
- Giảm thời gian chờ của người dùng.
- Enterprise Vision: chuẩn bị nền tảng cho Multi-Agent Architecture trong tương lai; không triển khai trong Phase 7.

---

#### Subgraph Architecture

Mỗi subgraph chịu trách nhiệm cho một nhóm nhiệm vụ riêng.

Ví dụ:

##### Retrieval Subgraph

- tìm tài liệu;
- truy xuất knowledge base;
- lấy evidence.

---

##### Policy Analysis Subgraph

- lấy điều khoản từ RAG;
- gọi Express để nhận business rule/eligibility result;
- giải thích ngoại lệ và kết quả do Express trả về.

---

##### Case History Subgraph

- gọi Express Business API để tìm các hồ sơ tương tự;
- thống kê kết quả xử lý trước đây.

---

##### Recommendation Subgraph

- đề xuất phương án xử lý;
- tạo Suggested Actions.

---

##### UI Generation Subgraph

- tạo Fixed-schema UI.
- chuẩn bị component render.

---

#### Streaming Execution

Thay vì đợi tất cả workflow hoàn thành rồi mới trả kết quả, hệ thống sẽ stream từng phần.

Ví dụ:

- Evidence xuất hiện trước.
- Timeline được cập nhật tiếp theo.
- Suggested Actions xuất hiện sau khi hoàn tất phân tích.
- Confidence Score được cập nhật cuối cùng.

Người dùng có thể quan sát toàn bộ quá trình AI làm việc theo thời gian thực.

---

#### Shared Context

Mặc dù mỗi subgraph hoạt động độc lập, tất cả đều sử dụng cùng một Shared State.

Điều này giúp:

- tránh mâu thuẫn dữ liệu;
- đồng bộ kết quả;
- giảm việc truyền dữ liệu lặp lại;
- duy trì một nguồn ngữ cảnh duy nhất.

---

#### Fault Isolation

Nếu một subgraph gặp lỗi, các subgraph còn lại vẫn tiếp tục hoạt động.

Ví dụ:

- Retrieval thành công.
- Policy Analysis thành công.
- Inventory Service lỗi.

Hệ thống vẫn trả về các kết quả đã có và chỉ hiển thị cảnh báo cho phần thất bại, thay vì làm hỏng toàn bộ workflow.

---

#### Business Value

Subgraphs Streaming giúp:

- giảm đáng kể thời gian phản hồi;
- tăng khả năng mở rộng của hệ thống;
- cải thiện trải nghiệm người dùng;
- dễ dàng bổ sung workflow mới;
- chuẩn bị nền tảng cho Agent Orchestration.

---

#### Deliverables

Phase này cần hoàn thành:

- LangGraph Workflow Composition.
- LangGraph Subgraph Definitions.
- LangGraph Parallel Branches.
- Streaming Event Protocol.
- Partial Result Aggregator.
- Shared Context Synchronization.
- Fault Isolation Mechanism.

---

#### Dependencies

Subgraphs Streaming phụ thuộc vào:

- Shared State.
- Redis Streams Event Bus.
- Workflow Coordinator.
- Express SSE Gateway.
- Internal HTTP giữa Express và FastAPI.
- Generative UI.
- Tool Registry.
- FastAPI LangGraph Runtime.

---

#### Risks

Nếu toàn bộ quy trình vẫn chạy tuần tự:

- thời gian phản hồi tăng theo số lượng tác vụ;
- khó mở rộng;
- khó debug;
- khó tái sử dụng workflow.

---

#### Acceptance Criteria

Phase Subgraphs Streaming được xem là hoàn thành khi:

- nhiều workflow có thể chạy song song.
- kết quả được stream ngay khi từng workflow hoàn thành.
- lỗi của một workflow không làm gián đoạn toàn bộ hệ thống.
- Shared State luôn được đồng bộ giữa các subgraph.

---

### Phase 8 – Multimodal

| Gate | Value |
| --- | --- |
| Architecture Horizon | Planned Evolution |
| Implementation Status | Planned |
| Prerequisite | Phase 7 exit criterion, Express Upload API and governed object storage |
| Exit criterion | Authorized images/documents produce auditable multimodal Evidence without bypassing Express |
| Authoritative architecture | [Multimodal Architecture](../architecture/MULTIMODAL.md#14-multimodal-architecture) |

#### Background

Trong thực tế, dữ liệu phục vụ bảo hành không chỉ tồn tại dưới dạng văn bản. Nhân viên thường phải làm việc với hình ảnh sản phẩm, ảnh lỗi, hóa đơn, phiếu bảo hành, tài liệu PDF, biên bản kỹ thuật và nhiều loại dữ liệu khác.

Nếu AI chỉ xử lý văn bản, người dùng vẫn phải tự diễn giải hoặc nhập lại thông tin từ các tài liệu này. Điều đó làm giảm hiệu quả của toàn bộ hệ thống.

Multimodal là giai đoạn cuối trong roadmap, mở rộng khả năng của Agent từ xử lý văn bản sang hiểu nhiều loại dữ liệu khác nhau trong cùng một workflow.

---

#### Objectives

Phase này hướng tới:

- Hỗ trợ nhiều loại dữ liệu đầu vào.
- Tự động phân tích tài liệu và hình ảnh.
- Kết hợp dữ liệu đa phương tiện vào quá trình suy luận.
- Tăng mức độ tự động hóa trong quy trình bảo hành.
- Hoàn thiện năng lực của AI Copilot.

---

#### Supported Modalities

Hệ thống dự kiến hỗ trợ:

##### Images

- ảnh sản phẩm;
- ảnh lỗi;
- ảnh linh kiện;
- ảnh tem bảo hành;
- ảnh hóa đơn.

---

##### Documents

- PDF.
- Warranty Card.
- Repair Report.
- Invoice.
- Technical Manual.

---

##### Structured Data

- ERP Data qua Express connector/API.
- Product Metadata qua Express Business API.
- Warranty Records qua Express Business API.
- Inventory Information qua Express Business API.

---

##### Enterprise Vision — Future Extensions

Trong các giai đoạn tiếp theo, hệ thống có thể mở rộng sang:

- Voice.
- Video.
- Live Camera.
- IoT Sensor Data.

---

#### Multimodal Workflow

Một workflow điển hình có thể diễn ra như sau:

1. Người dùng tải ảnh qua Express Upload API; Express xác thực, kiểm tra file và lưu object.
2. Express chuyển reference an toàn tới FastAPI để AI nhận diện khu vực hư hỏng.
3. AI đọc hóa đơn và phiếu bảo hành.
4. AI truy xuất chính sách phù hợp.
5. AI đối chiếu lịch sử sửa chữa.
6. AI đưa ra kết luận và đề xuất phương án xử lý.
7. Giao diện hiển thị kết quả cùng Evidence và Suggested Actions.

Toàn bộ quy trình diễn ra trong một phiên làm việc thống nhất.

---

#### Multimodal RAG

Không chỉ văn bản được lập chỉ mục.

Các loại dữ liệu khác cũng trở thành nguồn tri thức.

Ví dụ:

- hình ảnh được gắn embedding;
- PDF được OCR và chunking;
- metadata và embedding knowledge được lưu trong PostgreSQL + pgvector;
- kết quả truy xuất kết hợp giữa văn bản và hình ảnh.

Điều này giúp AI có thể trả lời các câu hỏi dựa trên nhiều nguồn dữ liệu khác nhau.

---

#### User Experience

Người dùng không cần mô tả bằng lời mọi tình huống.

Họ chỉ cần:

- tải ảnh;
- kéo thả tài liệu;
- chọn hồ sơ.

AI sẽ tự động phân tích và kết hợp các nguồn dữ liệu để tạo ra một câu trả lời hoàn chỉnh.

---

#### Business Value

Multimodal giúp:

- giảm thời gian nhập liệu;
- tăng độ chính xác của AI;
- tận dụng toàn bộ dữ liệu doanh nghiệp;
- hỗ trợ nhiều tình huống thực tế hơn;
- hoàn thiện trải nghiệm AI Copilot.

---

#### Deliverables

Phase này cần hoàn thành:

- Image Understanding Pipeline.
- OCR Pipeline.
- Document Parsing Engine.
- Multimodal Embedding Pipeline.
- Multimodal RAG.
- Express File Upload Integration.
- Unified Context Builder.

---

#### Dependencies

Multimodal phụ thuộc vào:

- RAG Pipeline.
- Shared State.
- Reasoning Trace.
- Generative UI.
- Subgraphs Streaming.
- Knowledge Base.
- Express Upload API và Object Storage.
- Express Business APIs cho structured data.

---

#### Risks

Việc xử lý dữ liệu đa phương tiện làm tăng đáng kể độ phức tạp của hệ thống:

- chi phí xử lý cao hơn;
- yêu cầu lưu trữ lớn hơn;
- thời gian suy luận dài hơn;
- cần cơ chế bảo vệ dữ liệu nhạy cảm.

Do đó, Multimodal được triển khai sau khi toàn bộ nền tảng Agentic AI đã ổn định.

---

#### Acceptance Criteria

Phase Multimodal được xem là hoàn thành khi:

- AI có thể xử lý đồng thời văn bản, hình ảnh và tài liệu.
- Người dùng không cần nhập lại dữ liệu đã có trong file tải lên.
- Evidence được tạo từ nhiều nguồn dữ liệu khác nhau.
- Toàn bộ kết quả vẫn tuân theo Shared State và Fixed-schema Generative UI.
- Multimodal trở thành một phần tự nhiên của mọi workflow thay vì là một tính năng độc lập.

## Best Practices

Keep current decisions separate from Planned Evolution and Enterprise Vision material.

## Future Evolution

Future changes require the review and ADR controls described in the related documents.

## References

- [Legacy source](../../documents/ROADMAP_MASTER.md)

## Related ADRs

- [ADR-001: AI-native architecture](../adr/ADR-001-ai-native-architecture.md)
- [ADR-002: PostgreSQL and Redis state ownership](../adr/ADR-002-postgresql-and-redis-state-ownership.md)
- [ADR-010: Event-driven AI runtime](../adr/ADR-010-event-driven-ai-runtime.md)

## Related Documents

- [Roadmap Master](./ROADMAP_MASTER.md)
- [Technical Master Plan](../architecture/TECHNICAL_MASTER_PLAN.md)
- [DevOps Master Plan](../platform/DEVOPS_MASTER_PLAN.md)
- [Glossary](../glossary/GLOSSARY.md)
