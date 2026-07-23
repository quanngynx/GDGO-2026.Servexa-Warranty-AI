# Glossary

## Purpose

Provide one canonical location for Servexa Warranty AI terminology.

## Canonical Terms

### Appendix D. Glossary

---

<a id="glossary-express"></a>

#### Express

Node.js platform sở hữu API Gateway, Business Platform, Workflow Gateway, Streaming Gateway, authentication, authorization, CRUD, upload và business execution.

---

<a id="glossary-ai-runtime"></a>

#### FastAPI AI Runtime

Python runtime sở hữu LangGraph, planning, Context Builder, retrieval, Tool orchestration, reasoning, UI generation và Event production.

---

<a id="glossary-langgraph"></a>

#### LangGraph

Workflow engine hiện tại, sở hữu graph control flow, typed state, interrupt/resume và PostgreSQL checkpoint integration.

---

<a id="glossary-agent"></a>

#### Agent

AI component chịu trách nhiệm điều phối workflow.

---

<a id="glossary-planner"></a>

#### Planner

Tạo Execution Plan có version từ Unified Context. Planner không trực tiếp gọi Tool, ghi business data hoặc thực thi business action.

---

#### Subgraph

Một workflow nhỏ.

Ví dụ:

- Retrieval
- Tool
- UI

---

<a id="glossary-workflow"></a>

#### Workflow

Chuỗi các bước nhằm hoàn thành một mục tiêu nghiệp vụ.

---

<a id="glossary-workflow-coordinator"></a>

#### Workflow Coordinator

Infrastructure component điều phối Redis Streams delivery, worker scheduling, retry, timeout và resume request; không thay thế LangGraph.

---

<a id="glossary-shared-state"></a>

#### Shared State

Redis coordination context dùng chung theo contract giữa:

- Frontend
- Backend
- AI Runtime

Frontend chỉ giữ projection; PostgreSQL qua Express là business source of truth.

---

#### Conversation Memory

Bộ nhớ của Agent.

Không phải Database.

---

#### Working Memory

Context ngắn hạn phục vụ workflow hiện tại.

---

#### Semantic Memory

Tri thức được rút ra từ hội thoại.

---

#### Long-term Memory

Tri thức lưu qua nhiều phiên làm việc.

---

#### RAG

Retrieval-Augmented Generation.

Kết hợp Retrieval và LLM để giảm Hallucination.

---

#### Retrieval

Quá trình tìm kiếm dữ liệu liên quan.

---

#### Re-ranking

Sắp xếp lại kết quả Retrieval.

---

#### Embedding

Vector biểu diễn ngữ nghĩa của dữ liệu.

---

#### Chunk

Đơn vị nhỏ nhất được lập chỉ mục trong Knowledge Base.

---

#### pgvector

PostgreSQL extension lưu Embedding phục vụ Semantic Search.

---

<a id="glossary-evidence"></a>

#### Evidence

Thông tin được sử dụng làm căn cứ cho câu trả lời của AI.

---

#### Citation

Liên kết giữa Evidence và tài liệu gốc.

---

<a id="glossary-suggested-actions"></a>

#### Suggested Actions

Các hành động AI đề xuất cho người dùng.

---

#### Human-in-the-loop (HITL)

Con người tham gia phê duyệt các quyết định quan trọng trước khi workflow tiếp tục.

---

<a id="glossary-reasoning-trace"></a>

#### Reasoning Trace

Giải thích có cấu trúc về quá trình AI đưa ra khuyến nghị.

Không phải Chain of Thought.

---

<a id="glossary-fixed-schema-generative-ui"></a>

#### Fixed-schema Generative UI

AI chỉ sinh JSON Schema.

Frontend chịu trách nhiệm render Component.

---

<a id="glossary-tool"></a>

#### Tool

Khả năng cho phép Agent tương tác với hệ thống bên ngoài.

---

<a id="glossary-tool-registry"></a>

#### Tool Registry

Danh mục toàn bộ Tool mà Agent được phép sử dụng.

---

<a id="glossary-tool-calling"></a>

#### Tool Calling

Quá trình Execution Plan khai báo capability, FastAPI Tool Executor điều phối lời gọi và Express xác thực, phân quyền, thực thi business capability.

---

<a id="glossary-event-bus"></a>

#### Event Bus

Redis Streams dùng cho workflow event giữa các runtime/worker. Frontend không tham gia Event Bus; Frontend chỉ nhận event đã lọc qua Express SSE Gateway.

---

#### Streaming

Truyền kết quả theo thời gian thực thay vì chờ toàn bộ workflow hoàn thành.

---

#### State Patch

Một thay đổi nhỏ của Shared State được truyền dưới dạng Patch thay vì toàn bộ State.

---

<a id="glossary-context-builder"></a>

#### Context Builder

Thành phần tổng hợp:

- User Messages
- Shared State
- Memory
- Evidence
- Tool Result

để tạo Prompt cho Planner.

---

#### Knowledge Base

Kho tri thức của doanh nghiệp phục vụ RAG.

---

#### Knowledge Graph

Đồ thị tri thức kết nối Product, Warranty, Customer, Repair và các thực thể nghiệp vụ nhằm hỗ trợ suy luận nâng cao.

---

#### Model Gateway

Lớp trừu tượng giúp định tuyến yêu cầu đến nhiều nhà cung cấp LLM (OpenAI, Anthropic, Gemini, Local LLM...) mà không làm thay đổi Business Logic.

---

#### AI Runtime

Runtime chịu trách nhiệm điều phối Planner, Tool Calling, RAG, Memory, Streaming và toàn bộ vòng đời của Agent.

## Roadmap Terminology Context

#### Glossary

##### Agent

Thành phần AI có khả năng lập kế hoạch, sử dụng công cụ, truy xuất tri thức và tương tác với người dùng trong suốt một workflow.

---

##### Shared State

Redis coordination state dùng chung theo contract. Frontend chỉ giữ projection qua Express API/SSE; PostgreSQL qua Express là business source of truth.

---

##### Human-in-the-loop (HITL)

Cơ chế yêu cầu con người xem xét và phê duyệt trước khi Express thực hiện business action do AI đề xuất.

---

##### Evidence

Danh sách nguồn dữ liệu, tài liệu hoặc chính sách được AI sử dụng để đưa ra kết luận.

---

##### Reasoning Trace

Bản tóm tắt có cấu trúc về quá trình AI phân tích và đưa ra khuyến nghị, được thiết kế để tăng tính minh bạch mà không tiết lộ suy luận nội bộ của mô hình.

---

##### Fixed-schema Generative UI

Phương pháp để AI sinh ra giao diện thông qua một schema chuẩn hóa thay vì trực tiếp tạo HTML hoặc mã nguồn giao diện.

---

##### Subgraph

Một workflow hoặc tác vụ độc lập có thể được thực thi song song với các workflow khác nhưng vẫn chia sẻ cùng ngữ cảnh.

---

##### Multimodal

Khả năng xử lý đồng thời nhiều loại dữ liệu như văn bản, hình ảnh, tài liệu PDF và dữ liệu có cấu trúc trong cùng một workflow.

---

## Platform Terminology Context

### Appendix H — Glossary

| Term                 | Definition                                                                                                                                      |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Agent                | An AI-driven workflow capable of planning and executing tasks using tools.                                                                      |
| Planner              | Component responsible for determining the execution strategy for a user request.                                                                |
| Context Builder      | Component that assembles conversation history, shared state, evidence, and retrieved knowledge into the context provided to the language model. |
| Tool Executor        | Runtime component responsible for executing synchronous or asynchronous tools selected by the Planner.                                          |
| Shared State         | External workflow state stored in Redis and shared across runtime components.                                                                   |
| Evidence             | Structured references supporting AI-generated responses.                                                                                        |
| Suggested Action     | A recommended follow-up operation that can be executed by the user or the system.                                                               |
| Workflow Coordinator | Component responsible for coordinating asynchronous workflows, retries, and resume operations.                                                  |
| Event Bus            | Messaging backbone implemented using Redis Streams for asynchronous workflow communication.                                                     |
| Checkpoint           | Persisted workflow state managed by LangGraph to support interruption and recovery.                                                             |
| RAG                  | Retrieval-Augmented Generation using pgvector as the semantic knowledge store.                                                                  |
| HITL                 | Human-in-the-loop workflow where user approval is required before continuing execution.                                                         |
| SSE                  | Server-Sent Events used to stream AI responses and workflow events to the frontend.                                                             |

---

## Related Documents

- [Documentation Index](../README.md)
- [Technical Master Plan](../architecture/TECHNICAL_MASTER_PLAN.md)
- [DevOps Master Plan](../platform/DEVOPS_MASTER_PLAN.md)
