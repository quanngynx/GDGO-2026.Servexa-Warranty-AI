# AI Runtime

> Canonical handbook. The preserved source material remains under `documents/`.

## Purpose

Define FastAPI and LangGraph as the canonical AI orchestration runtime.

## Scope

Agent lifecycle, RAG, knowledge, tools, memory, subgraphs, runtime ownership, and AI evolution.

## Dependencies

Business authority remains with Express and PostgreSQL; asynchronous delivery uses Redis Streams.

## Background

<a id="ai-runtime-policy"></a>

### AI runtime policy (Phase 1–2)

This document encodes [servexa_warranty_ai_plan_revision_recommendations_report.md](../../documents/servexa_warranty_ai_plan_revision_recommendations_report.md) and the Phase 1–2 execution plan. **Do not duplicate orchestration in Node** once the Python path carries full execution context.

#### Runtime ownership

| Layer | Role |
|-------|------|
| **Node (`apps/server`)** | API gateway, authentication, validation, **orchestration entrypoint only**, publishing to Redis, gRPC client to Python, optional **lightweight** Node Gemini fallback when gRPC is unavailable and policy allows. |
| **Python (`apps/ai-services`)** | **Single orchestration authority**: LangGraph coordinator, tool execution, async job handling from Redis, gRPC `ai.v1.AiService` implementation. |

#### Runtime mode (sync vs async)

**MUST be async** (Redis job → worker → Python): document ingestion at scale, report generation, summarization pipelines, bulk retrieval, multi-step / long-running reasoning, background enrichment.

**MAY be sync** (unary gRPC / short Node path): lightweight chat, autocomplete, short RAG-augmented Q&A, simple classification, explicitly allowlisted low-latency routes.

Encoding: see `apps/server/src/modules/v1/ai/runtime/ai-runtime-routing.ts` and job type routing in `AiJobStreamService`.

#### Memory stance

- **Default:** stateless HTTP/gRPC handling; no durable conversational memory in Phase 1–2.
- **Ephemeral Redis only:** job metadata, dedupe keys, optional cancel flags — always with explicit TTL (e.g. 86_400 seconds) documented in code.
- **Deferred:** general conversational memory until Phase 3+.
- **Allowlisted (Phase 2 HITL):** LangGraph checkpoint + thread IDs on `ai_human_approval_request` for interrupt/resume only — not full chat history retention.

#### Contracts

- Unary: `packages/proto/ai/v1/ai_service.proto` (`request_version`, `job_id`, `job_type`, `execution_context_json`).
- Streams: `packages/event-contracts` Zod schemas; DLQ payloads must match `aiJobDlqEnvelopeSchema`.

#### RAG corpus

- **Canonical:** Prisma `ai_knowledge_*` (used by Node retrieval and ingestion).
- **Non-product:** LangChain `PGVector` under `apps/ai-services` is experimental / isolated — see `apps/ai-services/src/modules/v1/rag/README.md`.


## Architecture

### 3. Agentic AI Architecture

#### Architecture Status

| Architecture Horizon | Implementation Status | Scope |
| --- | --- | --- |
| Current Decision | Partial | LangGraph Planner, Context Builder responsibilities, retrieval, tool execution, reasoning, UI output, event production |
| Planned Evolution | Planned | Explicit Execution Plan contract and Shared State Adapter |
| Enterprise Vision | Not Applicable | Multiple autonomous agents and distributed graph execution |

#### Design Principles

- Planner creates plans; it never executes tools or business actions.
- Context is assembled once through the Context Builder.
- Retrieval and business tools are separate data paths.
- Every recommendation is grounded and explainable.
- Runtime output is versioned and streamed through Express.
- LangGraph owns workflow control flow; infrastructure coordinates delivery.

#### AI Runtime Internal Architecture

```text
[Component Diagram]

Express Gateway
      │ [Sync Internal HTTP]
      ▼
Context Builder ──► Planner ──► Execution Plan
      ▲                           │
      │                 ┌─────────┼──────────┐
Messages / State        ▼         ▼          ▼
Evidence / Memory   Retriever  Tool Executor Reasoner
Tool Results            │         │          │
                        │         ▼          ▼
                        │    Express APIs  UI Generator
                        └─────────┬──────────┘
                                  ▼
                            Event Producer
                                  │ [Async Redis Streams]
                                  ▼
                        Express SSE Gateway
```

##### Planner

Planner nhận Unified Context và tạo **Execution Plan** gồm mục tiêu, bước, dependency, yêu cầu retrieval/tool, approval gate và output dự kiến. Planner không gọi Tool, không ghi Redis và không thực hiện business transaction.

##### Context Builder

Context Builder là điểm duy nhất hợp nhất:

- User Messages
- Shared State projection
- Evidence
- Conversation and workflow Memory
- Tool Results

Business data mới nhất luôn đến từ Express; knowledge evidence đến từ pgvector.

##### Retriever

Retriever thực hiện query rewrite, embedding, pgvector search, metadata filtering, reranking và Evidence mapping. Retriever không truy vấn business tables.

##### Reasoner

Reasoner tổng hợp context, Evidence, Tool Results và Business Rule Results từ Express để tạo grounded summary, confidence, Reasoning Trace và Suggested Actions.

##### Tool Executor

Tool Executor nhận từng tool step từ Execution Plan, kiểm tra schema, áp dụng retry policy và gọi Tool Layer. Express vẫn là authorization authority và business executor.

##### UI Generator

UI Generator tạo Fixed-schema UI `1.0`; không tạo HTML, JSX hoặc business state mutation.

##### Event Producer

Event Producer tạo versioned Event Envelope và ghi workflow output vào Redis Streams. Browser delivery luôn đi qua Express SSE Gateway.

#### Workflow Coordinator as a Core Component

| Architecture Horizon | Implementation Status |
| --- | --- |
| Current Decision | Partial |

Workflow Coordinator là infrastructure coordinator, không phải workflow engine thay thế LangGraph.
Status is Partial because Redis workers and LangGraph coordination exist, while the complete target scheduling, retry, timeout and resume path is not yet implemented end to end.

Responsibilities:

- coordinate Redis Streams events;
- schedule asynchronous workers;
- apply bounded retry and DLQ policy;
- track timeout;
- request LangGraph resume through Internal HTTP.

LangGraph remains responsible for graph edges, state transitions, interrupt and checkpoint semantics.

#### Why Agentic AI

Chatbot truyền thống chỉ thực hiện:

Input

↓

LLM

↓

Output

Trong khi Servexa Warranty AI cần:

Input

↓

Planning

↓

Retrieval

↓

Reasoning

↓

Tools

↓

State Update

↓

UI

↓

Human Approval

↓

Business Action

Đây là lý do cần Agent Architecture.

---

#### Architecture Overview

```text
[Component Diagram]
             User
               │
               ▼
          Conversation
               │
               ▼
         Context Builder
               │
               ▼
            Planner
               │
               ▼
         Execution Plan
               │
      ┌────────┼─────────┐
      ▼        ▼         ▼
 Retriever Tool Executor Reasoner
      │        │         │
      └────────┼─────────┘
               ▼
         Reasoning Engine
               │
               ▼
        UI Generation
               │
               ▼
         Streaming Output
```

---

#### Core Components

##### Planner

Chịu trách nhiệm:

- phân tích yêu cầu;
- lập kế hoạch;
- chọn workflow;
- quyết định tool cần gọi.

Planner không trực tiếp sinh câu trả lời.

---

##### Context Builder

Thu thập:

- Conversation
- Shared State
- User projection từ Express
- Product projection từ Express
- Repair Case projection từ Express
- Memory

Tạo Unified Context.

---

##### Tool Executor

Quản lý:

- Tool Registry
- Validation
- Retry
- Error Handling

Express thực hiện Authentication, Authorization và business-rule enforcement cho mọi business tool.

---

##### Memory Manager

Quản lý:

- Session Memory
- Semantic Memory
- Conversation Memory

---

##### Reasoning Engine

Tổng hợp:

- Evidence
- Tool Result
- Context
- Business Rule Result từ Express

để sinh Recommendation.

---

##### UI Generator

Sinh:

- Cards
- Timeline
- Suggested Actions
- Evidence
- Approval

theo Fixed Schema.

---

#### Agent Lifecycle

Một Agent hoạt động theo chu trình:

Observe

↓

Understand

↓

Plan

↓

Retrieve

↓

Call Tools

↓

Reason

↓

Generate UI

↓

Wait User

↓

Continue

Chu trình này có thể lặp lại nhiều lần trong cùng một workflow.

---

#### Shared Intelligence

Agent không hoạt động độc lập.

Nó liên tục đồng bộ với:

- Shared State
- Memory
- UI projection qua Express SSE
- Express Business API qua Internal HTTP

để luôn duy trì cùng một Business Context.

---

### 4. AI Workflow Lifecycle

#### Architecture Status

| Architecture Horizon | Implementation Status | Note |
| --- | --- | --- |
| Current Decision | Partial | Core LangGraph lifecycle exists; complete Execution Plan, event and SSE alignment remains incomplete. |

#### Lifecycle Overview

Toàn bộ vòng đời của một yêu cầu AI được chuẩn hóa nhằm đảm bảo mọi workflow đều tuân theo cùng một quy trình xử lý. Điều này giúp hệ thống dễ mở rộng, dễ kiểm thử và đảm bảo tính nhất quán giữa các loại tác vụ.

Một AI Workflow không đơn thuần là quá trình gửi prompt đến mô hình ngôn ngữ mà là chuỗi các bước từ tiếp nhận yêu cầu, xây dựng ngữ cảnh, lập kế hoạch, thực thi công cụ, suy luận, sinh giao diện và cập nhật trạng thái hệ thống.

---

#### End-to-End Flow

```text
[Data Flow Diagram]
User
 │
 ▼
Frontend
 │
 ▼
Express Gateway
 │
 ▼ [Sync Internal HTTP]
FastAPI AI Runtime
 │
 ▼
Context Builder
 │
 ▼
Planner
 │
 ▼
Execution Plan
 │
 ├─────────────► Tool Executor
 │
 ├─────────────► Retriever
 │
 ├─────────────► Memory
 │
 ▼
Reasoning Engine
 │
 ▼
Generative UI
 │
 ▼
Streaming Response
 │
 ▼
Redis Streams
 │
 ▼
Express SSE Gateway
 │
 ▼
Frontend Render
 │
 ▼
Human Approval (Optional)
 │
 ▼
Express Authorization + Business Execution
 │
 ▼
PostgreSQL Update → Redis Shared State Patch
```

---

#### Stage 1 — User Interaction

Workflow bắt đầu khi người dùng:

- gửi tin nhắn;
- tải tài liệu;
- tải hình ảnh;
- chọn một hồ sơ bảo hành;
- hoặc thực hiện thao tác trên giao diện.

Frontend chuyển đổi các hành động này thành request hoặc event chuẩn hóa và chỉ gửi tới Express Gateway. Sau khi xác thực và phân quyền, Express gọi FastAPI AI Runtime qua Internal HTTP khi workflow cần xử lý AI.

---

#### Stage 2 — Context Construction

Context Builder chịu trách nhiệm thu thập toàn bộ ngữ cảnh cần thiết trước khi Agent lập kế hoạch.

Nguồn dữ liệu bao gồm:

- lịch sử hội thoại;
- Shared State hiện tại;
- thông tin người dùng qua Express API;
- hồ sơ bảo hành qua Express API;
- metadata của sản phẩm qua Express API;
- bộ nhớ ngắn hạn và dài hạn;
- các tham số của workflow.

Kết quả là một **Unified Context** được truyền cho Planner.

---

#### Stage 3 — Planning

Planner phân tích yêu cầu và xác định chiến lược thực hiện.

Các quyết định có thể bao gồm:

- có cần Retrieval hay không;
- có cần gọi Tool hay không;
- workflow nào sẽ được kích hoạt;
- có cần Human-in-the-loop hay không;
- có cần sinh Generative UI hay chỉ trả về văn bản.

Planner không trực tiếp thực thi mà chỉ xây dựng kế hoạch.

---

#### Stage 4 — Execution

Execution Engine triển khai kế hoạch bằng cách:

- gọi Tool;
- truy xuất Knowledge Base;
- đọc Memory;
- thực hiện các Subgraph cần thiết.

Các tác vụ độc lập có thể được thực hiện song song để giảm độ trễ.

---

#### Stage 5 — Reasoning

Reasoning Engine tổng hợp toàn bộ dữ liệu từ:

- Context;
- Retrieval;
- Tool Results;
- Business Rule Results từ Express;
- Memory.

Sau đó tạo ra:

- Recommendation;
- Evidence;
- Confidence;
- Suggested Actions;
- Reasoning Summary.

Đây là lớp chuyển đổi dữ liệu thành quyết định có thể giải thích được.

---

#### Stage 6 — UI Generation

Nếu workflow yêu cầu tương tác trực quan, UI Generator sẽ sinh ra các component theo Fixed-schema.

Các component có thể bao gồm:

- Summary Card;
- Evidence Panel;
- Suggested Action Card;
- Timeline;
- Approval Request;
- Warning Banner.

Frontend chỉ cần render schema mà không phải hiểu logic nghiệp vụ.

---

#### Stage 7 — Streaming Response

FastAPI ghi workflow output vào Redis Streams; Express Streaming Gateway xác thực/lọc và gửi kết quả tới Frontend bằng SSE.

Hệ thống hỗ trợ:

- Token Streaming;
- Tool Event Streaming;
- UI Schema Streaming;
- State Patch Streaming;
- Workflow Progress Events.

Người dùng có thể quan sát quá trình AI làm việc theo thời gian thực.

---

#### Stage 8 — Human Decision

Nếu workflow chứa các hành động có rủi ro, Agent sẽ tạm dừng và chờ quyết định từ người dùng.

Các lựa chọn bao gồm:

- Approve;
- Reject;
- Modify;
- Request More Information.

Frontend gửi phản hồi tới Express để xác thực/phân quyền. LangGraph lưu interrupt trong PostgreSQL checkpointer và tiếp tục từ đúng checkpoint sau khi Express ghi quyết định/state patch.

---

#### Stage 9 — Business Execution

Express chịu trách nhiệm thực hiện các thay đổi nghiệp vụ sau khi đã được phê duyệt.

Các thao tác có thể bao gồm:

- cập nhật trạng thái hồ sơ;
- tạo yêu cầu sửa chữa;
- phân công kỹ thuật viên;
- tạo yêu cầu xuất kho;
- gửi thông báo.

AI không trực tiếp thay đổi dữ liệu mà luôn thông qua Business Layer.

---

#### Stage 10 — State Synchronization

Sau khi workflow hoàn tất, Express ghi business update vào PostgreSQL trước rồi cập nhật Redis Shared State projection.

Frontend và FastAPI tiếp tục dùng projection đã được Express cung cấp cho workflow tiếp theo; PostgreSQL vẫn là nguồn dữ liệu nghiệp vụ có thẩm quyền.

### Part II. Core Components

---

### 5. RAG Architecture

#### Architecture Status

| Architecture Horizon | Implementation Status |
| --- | --- |
| Current Decision | Partial |
| Planned Evolution | Planned production ingestion, evaluation and governance hardening |
| Enterprise Vision | Optional alternative vector infrastructure only through ADR |

#### Design Principles

- Evidence before generation.
- Knowledge retrieval is separate from business lookup.
- FastAPI reads knowledge from pgvector directly.
- Every result preserves source metadata and tenant scope.
- Retrieval failure never produces an unsupported conclusion.

#### Overview

Retrieval-Augmented Generation (RAG) là nền tảng giúp Servexa Warranty AI tạo ra các câu trả lời có căn cứ thay vì chỉ dựa trên kiến thức của mô hình ngôn ngữ. Trong bối cảnh nghiệp vụ bảo hành, AI không được phép đưa ra kết luận chỉ dựa trên xác suất của LLM mà phải dựa trên dữ liệu nội bộ của doanh nghiệp.

RAG đóng vai trò là lớp kết nối giữa mô hình ngôn ngữ và tri thức của tổ chức. Thay vì đưa toàn bộ tài liệu vào prompt, hệ thống sẽ truy xuất đúng các đoạn thông tin liên quan, kết hợp với ngữ cảnh hiện tại và sinh ra phản hồi có dẫn chứng.

---

#### Design Objectives

Kiến trúc RAG được xây dựng nhằm đạt các mục tiêu:

- Giảm hiện tượng hallucination.
- Tăng tính chính xác của AI.
- Hỗ trợ giải thích (Explainability).
- Hỗ trợ Citation và Evidence.
- Có khả năng mở rộng Knowledge Base.
- Giảm chi phí Prompt.

---

#### High-level Architecture

```text
[Data Flow Diagram]
Documents
     │
     ▼
Document Processing
     │
     ▼
Chunking
     │
     ▼
Embedding
     │
     ▼
PostgreSQL + pgvector
     │
     ▼
Retriever
     │
     ▼
Re-ranking
     │
     ▼
Prompt Builder
     │
     ▼
LLM
     │
     ▼
Evidence + Response
```

---

#### Document Ingestion Pipeline

Mọi nguồn tri thức đều đi qua cùng một pipeline.

```text
[Data Flow Diagram]
Upload API (Express)

↓

Validation

↓

OCR (optional)

↓

Cleaning

↓

Metadata Extraction

↓

Chunking

↓

Embedding

↓

Indexing

↓

PostgreSQL + pgvector
```

Pipeline thống nhất giúp đảm bảo mọi tài liệu đều được xử lý theo cùng một chuẩn.

---

#### Document Processing

Document Processor chịu trách nhiệm:

- đọc file;
- kiểm tra định dạng;
- OCR nếu cần;
- loại bỏ ký tự lỗi;
- chuẩn hóa encoding;
- chuẩn hóa heading;
- chuẩn hóa bảng.

Các định dạng hỗ trợ:

- PDF
- DOCX
- TXT
- HTML
- XLSX

Future:

- Images
- Markdown
- CSV
- JSON
- PowerPoint
- Email

---

#### Chunking Strategy

Current implementation sử dụng recursive character chunking có giới hạn kích thước (tối đa 1.200 ký tự) và overlap để giữ ngữ cảnh. Semantic Chunking là **Planned Evolution**, không phải hành vi hiện tại.

Ví dụ:

```text
Warranty Policy

Section

Paragraph

Bullet

Table
```

Mỗi chunk đều phải:

- giữ nguyên ngữ nghĩa;
- không cắt giữa điều khoản;
- có metadata đầy đủ.

Metadata bao gồm:

- source
- title
- section
- page
- version
- updatedAt

---

#### Embedding Pipeline

Embedding được tạo sau khi chunking.

```text
[Data Flow Diagram]
Chunk

↓

Embedding Model

↓

Vector

↓

Metadata

↓

PostgreSQL + pgvector
```

Embedding Model có thể thay đổi mà không ảnh hưởng các tầng khác.

Yêu cầu:

- multilingual
- semantic search
- high recall
- low latency

---

#### pgvector Storage

PostgreSQL với extension pgvector lưu:

- vector
- metadata
- document id
- chunk id
- version

Không lưu business logic.

**Enterprise Vision alternatives:** Milvus, Qdrant hoặc Pinecone chỉ được xem xét nếu yêu cầu vận hành trong tương lai không còn phù hợp với pgvector; chúng không thuộc current implementation.

---

#### Retrieval Pipeline

Khi Agent cần dữ liệu:

```text
[Data Flow Diagram]
Question

↓

Query Rewrite

↓

Embedding

↓

Vector Search

↓

Top K

↓

Metadata Filter

↓

Re-ranking

↓

Prompt
```

Retrieval luôn xảy ra trước Reasoning.

---

#### Query Rewriting

Planner có thể viết lại câu hỏi.

Ví dụ:

User:

> Máy hết bảo hành chưa?

Rewrite:

> Warranty eligibility based on purchase date and warranty policy.

Điều này tăng Recall đáng kể.

---

#### Metadata Filtering

Retrieval không tìm toàn bộ Knowledge Base.

Có thể filter theo:

- Product
- Brand
- Category
- Warranty Type
- Country
- Language
- Version

Điều này giảm nhiễu.

---

#### Re-ranking

Sau Retrieval:

Top 20

↓

Cross Encoder

↓

Top 5

↓

Prompt

Mục tiêu:

- tăng Precision
- giảm Context Length

---

#### Prompt Construction

Prompt Builder kết hợp:

- User Question
- Shared State
- Conversation Memory
- Retrieved Chunks
- Tool Results

Prompt không chứa toàn bộ tài liệu.

---

#### Citation Strategy

Mỗi Evidence gồm:

- document
- section
- page
- chunk id

Frontend có thể:

- highlight
- preview
- open source

---

#### RAG Evaluation

Các metric:

Retrieval

- Recall@K
- Precision@K
- MRR

Generation

- Faithfulness
- Groundedness
- Citation Accuracy
- Hallucination Rate

---

#### Caching Strategy

Cache tại nhiều tầng.

- Query Cache
- Embedding Cache
- Retrieval Cache
- Prompt Cache

Không cache Response cuối.

---

#### Failure Handling

Nếu Retrieval thất bại:

Agent:

- thông báo thiếu dữ liệu;
- không suy đoán;
- đề xuất người dùng bổ sung.

---

#### Deliverables

- Document Pipeline
- Chunking Engine
- Embedding Service
- Retrieval Engine
- Re-ranking
- Citation
- Evaluation Pipeline

---

### 6. Knowledge Management

#### Architecture Status

| Architecture Horizon | Implementation Status | Note |
| --- | --- | --- |
| Current Decision | Partial | pgvector retrieval exists; ingestion governance, lifecycle automation and operational validation remain incomplete. |

#### Overview

Knowledge Base là tài sản quan trọng nhất của Servexa Warranty AI.

LLM chỉ cung cấp khả năng suy luận.

Knowledge Base mới quyết định chất lượng câu trả lời.

Do đó hệ thống được thiết kế để tri thức có thể quản lý độc lập với mô hình AI.

---

#### Knowledge Domains

Tri thức được chia thành nhiều domain.

##### Warranty Policy

Bao gồm:

- thời hạn
- điều kiện
- ngoại lệ
- đổi trả

Policy document cung cấp Evidence; Express Business Rule Engine mới tạo eligibility/approval result có thẩm quyền.

---

##### Product Catalog

Bao gồm:

- model
- specification
- accessories
- warranty duration

Đây là tài liệu catalog đã publish vào Knowledge Base. Product record hiện hành và tồn kho vẫn được lấy qua Express Business API.

---

##### Repair Manual

Bao gồm:

- quy trình sửa
- checklist
- error code

---

##### SOP

Standard Operating Procedures.

Ví dụ:

- tiếp nhận
- phân loại
- bàn giao

---

##### FAQ

Các câu hỏi phổ biến.

---

##### Previous Cases

Chỉ bao gồm các case đã được tuyển chọn, khử định danh và xuất bản như knowledge document. Hồ sơ nghiệp vụ hiện hành không nằm trong Knowledge Base; FastAPI phải lấy chúng qua Express Business API.

---

#### Knowledge Lifecycle

```text
[State Diagram]
Create

↓

Review

↓

Publish

↓

Embedding

↓

Serving

↓

Archive
```

---

#### Version Management

Mỗi tài liệu có:

- version
- effective date
- expiration
- author

Agent luôn ưu tiên phiên bản mới nhất.

---

#### Knowledge Refresh

Pipeline hỗ trợ:

- manual update
- scheduled update
- webhook update

---

#### Metadata Schema

Ví dụ:

```yaml
document_id:

title:

category:

product:

brand:

language:

version:

effective_date:

updated_at:
```

---

#### Governance

Knowledge Owner chịu trách nhiệm:

- accuracy
- update
- review
- archive

AI không tự cập nhật Knowledge.

---

#### Deliverables

- Knowledge Repository
- Metadata Schema
- Versioning
- Knowledge Lifecycle
- Governance Policy

---

### 7. Tool Calling Architecture

#### Architecture Status

| Architecture Horizon | Implementation Status |
| --- | --- |
| Current Decision | Implemented: Tool Registry and Tool Executor |
| Planned Evolution | Planned: Tool Resolver and Tool Adapter |
| Enterprise Vision | Optional external tool protocols only after ADR |

#### Design Principles

- Planner records the required capability in the Execution Plan; Tool Executor performs orchestration.
- Express authenticates, authorizes and executes business capabilities.
- Every Tool has a versioned input/output contract.
- Write Tools are idempotent and auditable.
- Retry only applies to transient failures.

#### Tool Layer Model

##### Current Implemented Path

```text
[Component Diagram]

Tool Registry
      │
      ▼
Tool Executor
      │ [Sync Internal HTTP]
      ▼
Express Business APIs
```

##### Planned Evolution

```text
[Component Diagram]

Tool Registry
      │
      ▼
Tool Resolver (Planned)
      │
      ▼
Tool Executor
      │
      ▼
Tool Adapter (Planned)
      │ [Sync Internal HTTP]
      ▼
Express Business APIs
```

Tool Resolver maps an Execution Plan step to a registered capability. Tool Adapter isolates transport and contract mapping. Neither component is claimed as implemented.

#### Overview

Một Agent chỉ thực sự hữu ích khi có khả năng tương tác với hệ thống bên ngoài.

Tool Calling là cơ chế cho phép Agent truy cập các dịch vụ nghiệp vụ mà không cần nhúng business logic vào mô hình ngôn ngữ.

Mỗi Tool đại diện cho một năng lực cụ thể của hệ thống, ví dụ truy vấn dữ liệu, kiểm tra trạng thái bảo hành hoặc tạo yêu cầu xử lý. Agent chịu trách nhiệm quyết định **khi nào** cần sử dụng Tool, trong khi Backend chịu trách nhiệm **Tool sẽ hoạt động như thế nào**.

---

#### Design Principles

Tool Layer tuân theo các nguyên tắc:

- Tool không chứa Prompt.
- Tool không biết LLM.
- Tool độc lập với Model Provider.
- Tool có schema rõ ràng.
- Tool có thể kiểm thử độc lập.
- Tool phải có Permission.

---

#### Architecture

```text
[Component Diagram]
Execution Plan

↓

Tool Registry

↓

FastAPI Tool Executor

↓ [Sync Internal HTTP]

Express Authentication / Authorization / Business API

↓

Tool Result
```

---

#### Tool Registry

Tool Registry là danh mục trung tâm của toàn bộ Tool.

Mỗi Tool được khai báo bằng metadata.

Ví dụ:

```yaml
name:
description:
input_schema:
output_schema:
permission:
timeout:
retry:
```

Agent không gọi Tool theo URL mà theo tên và schema.

---

#### Tool Categories

##### Retrieval Tools

- Search Documents
- Search Warranty Policy

Các Tool này đọc knowledge embeddings trực tiếp từ pgvector trong FastAPI.

---

##### Business Tools

- Check Warranty
- Search Cases
- Get Product
- Get Inventory
- Get Technician

Các Tool này luôn gọi Express Business API.

---

##### Workflow Tools

- Create Repair
- Update Status
- Assign Technician
- Create Approval

---

##### Communication Tools

- Send Email
- Send Notification

---

##### Enterprise Vision — Future Tools

- ERP
- CRM
- SAP
- Microsoft Dynamics

---

#### Tool Selection

Planner ghi capability cần thiết vào Execution Plan; Tool Executor và Tool Registry chịu trách nhiệm resolve và điều phối Tool.

Tiêu chí lựa chọn bao gồm:

- ngữ cảnh hiện tại;
- Shared State;
- yêu cầu của người dùng;
- khả năng của Tool.

Planner có thể dùng metadata quyền để tránh đề xuất Tool không phù hợp, nhưng Express luôn là nơi xác thực và phân quyền có thẩm quyền trước khi đọc hoặc thay đổi business data.

---

#### Validation Layer

Trước khi thực thi, Tool Request được kiểm tra:

- schema hợp lệ;
- tham số bắt buộc;
- kiểu dữ liệu;
- trạng thái workflow.

FastAPI kiểm tra schema trước khi gọi. Express kiểm tra authentication, authorization và business precondition; mọi lỗi đều được trả về Agent theo contract có cấu trúc.

---

#### Permission Model

Không phải Tool nào cũng có thể được AI gọi.

Ví dụ:

Read Tool

✔ tự động

Write Tool

⚠ có thể cần Human Approval

Critical Tool

✖ luôn yêu cầu phê duyệt

Express đánh giá Permission dựa trên:

- vai trò người dùng;
- loại Tool;
- trạng thái workflow.

---

#### Execution Flow

```text
[Data Flow Diagram]
Execution Plan

↓

Tool Request

↓

Validation

↓

Permission

↓

Execution

↓

Response

↓

Reasoning
```

Tool Result luôn được chuẩn hóa trước khi đưa vào Reasoning Engine.

---

#### Retry Strategy

Một Tool có thể được retry khi gặp lỗi tạm thời.

Chính sách mặc định:

- tối đa 3 lần;
- exponential backoff;
- timeout độc lập.

Không retry đối với lỗi nghiệp vụ.

---

#### Error Handling

Tool trả về lỗi theo schema thống nhất:

- Validation Error
- Permission Denied
- Business Error
- Timeout
- External Service Error

Reasoning Engine sẽ sử dụng thông tin này để quyết định cách phản hồi thay vì để lỗi lan trực tiếp đến người dùng.

---

#### Observability

Mỗi lần gọi Tool đều được ghi nhận:

- Tool Name
- Execution Time
- Request ID
- Workflow ID
- User ID
- Status
- Retry Count

Các log này phục vụ:

- debugging;
- monitoring;
- cost analysis;
- audit.

---

#### Deliverables

- Tool Registry
- Tool SDK
- Validation Layer
- Express Tool Authorization Integration
- Execution Runtime
- Retry Policy
- Error Protocol
- Tool Observability

### 9. Conversation Memory

#### Architecture Status

| Architecture Horizon | Implementation Status | Note |
| --- | --- | --- |
| Current Decision | Partial | Conversation persistence exists; normalized memory extraction, retention and Shared State integration remain incomplete. |

#### Overview

Conversation Memory giúp Agent duy trì tính liên tục của hội thoại và workflow.

Khác với Shared State, Memory không lưu trạng thái nghiệp vụ mà lưu **tri thức phát sinh trong quá trình tương tác**.

Nếu Shared State trả lời câu hỏi:

> "Hệ thống đang ở trạng thái nào?"

thì Conversation Memory trả lời:

> "Agent đã biết gì?"

Hai thành phần này bổ sung cho nhau để tạo nên một Agent có khả năng cộng tác lâu dài.

---

#### Design Goals

Conversation Memory hướng tới:

- Giảm việc hỏi lại người dùng.
- Duy trì ngữ cảnh dài hạn.
- Hỗ trợ Reasoning.
- Hỗ trợ Planner.
- Giảm kích thước Prompt.
- Hỗ trợ Multi-turn Conversation.

---

#### Memory Architecture

```text
[Component Diagram]
Conversation

↓

Short-term Memory

↓

Working Memory

↓

Semantic Memory

↓

Long-term Memory

↓

Prompt Builder
```

---

#### Memory Types

##### Short-term Memory

Lưu:

- vài lượt hội thoại gần nhất;
- Tool Result mới;
- UI Interaction.

Được sử dụng trong mọi Prompt.

---

##### Working Memory

Đại diện cho "suy nghĩ hiện tại" của Agent.

Ví dụ:

- mục tiêu workflow;
- bước hiện tại;
- action đang thực hiện.

Working Memory bị xóa sau khi workflow hoàn thành.

---

##### Semantic Memory

Lưu các tri thức đã được rút ra.

Ví dụ:

- khách hàng thích nhận email;
- sản phẩm thuộc doanh nghiệp;
- hồ sơ thường thiếu hóa đơn.

Semantic Memory không lưu nguyên văn cuộc hội thoại.

---

##### Long-term Memory

Lưu:

- Case Summary
- Workflow Summary
- Important Decisions
- User Preferences
- Historical Context

Long-term Memory được truy xuất theo nhu cầu thay vì luôn đưa vào Prompt.

---

#### Conversation Summarization

Để tránh Prompt ngày càng dài, hệ thống định kỳ tạo Summary.

Ví dụ:

```text
[Data Flow Diagram]
20 Messages

↓

Conversation Summary

↓

Archive Messages

↓

Prompt Uses Summary
```

Điều này giúp:

- giảm Token;
- tăng tốc độ;
- giữ được ngữ cảnh.

---

#### Memory Retrieval

Planner quyết định:

- có cần Memory hay không;
- loại Memory nào cần đọc;
- số lượng Context cần đưa vào Prompt.

Không phải mọi Prompt đều sử dụng toàn bộ Memory.

---

#### Memory Lifecycle

```text
[State Diagram]
Conversation

↓

Extract Knowledge

↓

Summarize

↓

Store

↓

Retrieve

↓

Update

↓

Archive
```

---

#### Memory Eviction

Một số dữ liệu cần được loại bỏ.

Ví dụ:

- thông tin lỗi thời;
- workflow đã hủy;
- dữ liệu tạm thời.

Điều này giúp Memory luôn chính xác.

---

#### Privacy Considerations

Conversation Memory chỉ lưu dữ liệu phục vụ nghiệp vụ.

Không lưu:

- Prompt nội bộ;
- Chain of Thought;
- API Key;
- Secret;
- Sensitive Token.

Các thông tin cá nhân được xử lý theo chính sách bảo mật của doanh nghiệp.

---

#### Relationship with Shared State

Shared State và Memory không thay thế nhau.

| Shared State           | Memory                |
| ---------------------- | --------------------- |
| Current Status         | Historical Knowledge  |
| Single Source of Truth | Learned Context       |
| UI Driven              | AI Driven             |
| Business Workflow      | Conversation Workflow |

---

#### Relationship with RAG

Memory không thay thế Knowledge Base.

Memory trả lời:

> "Điều gì đã xảy ra?"

Knowledge Base trả lời:

> "Doanh nghiệp quy định như thế nào?"

Agent kết hợp cả hai nguồn trước khi đưa ra Recommendation.

---

#### Enterprise Vision — Future Extensions

Conversation Memory có thể mở rộng thành:

- Cross-session Memory
- Organization Memory
- Team Shared Memory
- Multi-Agent Memory
- Knowledge Distillation

---

#### Deliverables

- Short-term Memory
- Working Memory
- Semantic Memory
- Long-term Memory
- Conversation Summarizer
- Memory Retrieval Engine
- Memory Lifecycle Manager
- Memory Governance Policy

### Part II-D. Advanced Agent Runtime

---

### 13. Subgraphs Streaming

#### Architecture Status

| Architecture Horizon | Implementation Status | Note |
| --- | --- | --- |
| Current Decision | Partial | LangGraph/subgraph foundations exist; complete parallel result isolation and Express SSE projection remain incomplete. |

#### Overview

Khi Servexa Warranty AI phát triển từ một Agent đơn lẻ thành một hệ thống có khả năng xử lý nhiều loại nghiệp vụ đồng thời, việc thực thi toàn bộ workflow theo một chuỗi tuần tự sẽ nhanh chóng trở thành nút thắt về hiệu năng và khả năng mở rộng.

Subgraphs Streaming được thiết kế để chia một workflow lớn thành nhiều workflow nhỏ (Subgraph), mỗi Subgraph chịu trách nhiệm cho một nhóm nhiệm vụ riêng biệt nhưng vẫn chia sẻ cùng một Business Context thông qua Shared State.

Kiến trúc này cho phép nhiều tiến trình AI hoạt động đồng thời, stream kết quả ngay khi hoàn thành và giảm đáng kể thời gian phản hồi của hệ thống.

---

#### Design Goals

Subgraphs Streaming hướng tới:

- Thực thi nhiều workflow song song.
- Giảm latency.
- Tăng khả năng mở rộng.
- Giảm coupling giữa các module AI.
- Hỗ trợ Streaming theo từng bước.
- Enterprise Vision: chuẩn bị khả năng mở rộng Multi-Agent nhưng không triển khai trong horizon hiện tại.

---

#### Architecture Overview

```text
[Component Diagram]
                Planner
Cross-service edges: [Async Redis Streams] · [SSE]
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
 Retrieval     Tool Graph   Memory Graph
        │          │          │
        ├──────────┼──────────┤
        ▼          ▼          ▼
 Policy Graph  Evidence Graph UI Graph
        │          │          │
        └──────────┼──────────┘
                   ▼
            Result Aggregator
                   │
                   ▼
          Redis Streams Event Bus
                   │
                   ▼
        Express SSE Gateway
                   │
                   ▼
               Frontend
```

---

#### Why Subgraphs

Một workflow bảo hành điển hình thường cần thực hiện đồng thời nhiều tác vụ.

Ví dụ:

- đọc Warranty Policy;
- kiểm tra Product Information;
- truy xuất Repair History;
- lấy Warranty Eligibility Result qua Express;
- kiểm tra Inventory;
- sinh Suggested Actions.

Các tác vụ này không phụ thuộc trực tiếp vào nhau.

Nếu thực hiện tuần tự:

```text
[Data Flow Diagram]
Task A

↓

Task B

↓

Task C

↓

Task D
```

thời gian phản hồi sẽ tăng tuyến tính.

Thay vào đó:

```text
[Data Flow Diagram]
Task A
Task B
Task C
Task D

↓

Parallel Execution

↓

Merge Result
```

---

#### Graph Composition

Planner không trực tiếp xử lý toàn bộ nghiệp vụ.

Planner chỉ quyết định:

- Graph nào cần chạy.
- Graph nào có thể chạy song song.
- Graph nào phụ thuộc Graph khác.

Ví dụ:

```text
[Data Flow Diagram]
Planner

↓

Retrieval Graph

↓

Policy Graph

↓

Recommendation Graph
```

---

#### Standard Subgraphs

##### Retrieval Graph

Chịu trách nhiệm:

- Query Rewrite
- Embedding
- Retrieval
- Reranking

Output:

Evidence Set

---

##### Tool Graph

Chịu trách nhiệm:

- Tool Calling
- Validation
- Retry
- Consume Express authorization result

Output:

Business Data

---

##### Memory Graph

Đọc:

- Conversation Memory
- Semantic Memory
- Workflow Memory

Output:

Memory Context

---

##### Policy Graph

Gọi Express Business API để nhận kết quả đánh giá:

- Warranty Rules
- Exceptions
- Eligibility

Output:

Business Rule Result

---

##### Reasoning Graph

Tổng hợp:

- Evidence
- Tool Result
- Policy
- Memory

Output:

Recommendation

---

##### UI Graph

Sinh:

- UI Schema
- Cards
- Timeline
- Suggested Actions

---

#### Shared Context

Mọi Graph đều sử dụng cùng Shared Context.

Không Graph nào tự lưu trạng thái riêng.

Điều này giúp:

- tránh xung đột;
- tránh dữ liệu trùng lặp;
- giảm Prompt Size.

---

#### Graph Communication

Các Graph trong cùng LangGraph workflow trao đổi qua graph edges và typed graph state. Redis Streams được dùng cho event liên dịch vụ, tác vụ bất đồng bộ và streaming lifecycle; không thay thế control flow nội bộ của LangGraph.

Ví dụ:

```text
[Sequence Diagram]
Retrieval Finished

↓

Evidence Ready

↓

Reasoning Starts
```

Quan hệ phụ thuộc giữa các Graph phải được khai báo rõ trong LangGraph; không dùng lời gọi tùy ý ngoài graph definition.

---

#### Streaming Strategy

Thay vì chờ toàn bộ workflow.

Hệ thống stream theo từng Event.

Ví dụ:

```text
[Sequence Diagram]
Evidence Ready

↓

UI Update

↓

Tool Finished

↓

Recommendation Ready

↓

Approval Ready
```

Người dùng luôn thấy tiến trình xử lý.

---

#### Partial Rendering

Frontend có thể render từng phần.

Ví dụ:

```text
[Sequence Diagram]
Evidence Card

↓

Timeline

↓

Recommendation

↓

Approval
```

Không cần đợi toàn bộ workflow.

---

#### Fault Isolation

Nếu một Graph lỗi.

Ví dụ:

Inventory Graph

↓

Timeout

↓

Warning

↓

Workflow Continues

Các Graph khác vẫn hoạt động.

---

#### Retry Policy

Retry chỉ áp dụng:

- External Tool
- Retrieval
- Network

Không retry:

- Business Rule
- Validation Error

---

#### Scalability

Trong current architecture, các Graph là module/subgraph bên trong một FastAPI AI Runtime và được version cùng workflow. **Future/Enterprise Evolution:** nếu có bằng chứng vận hành cần tách dịch vụ, một số workload có thể scale hoặc deploy riêng; đây không phải current implementation.

---

#### Observability

Mỗi Graph được log:

- graph id
- workflow id
- latency
- input
- output
- retry
- status

---

#### Enterprise Vision — Future Extensions

- Distributed Graph
- Remote Graph
- GPU Graph
- Multi-Agent Graph
- Dynamic Graph Scheduling

---

#### Deliverables

- LangGraph Runtime
- LangGraph Graph Definitions
- Redis Streams Event Bus
- Result Aggregator
- Subgraph Registry
- LangGraph Parallel Branches
- Graph Observability

---

### 73. AI Runtime Architecture

```text
User Request

↓

Express

↓

FastAPI

↓

Planner

↓

Context Builder

↓

Retriever

↓

Reasoner

↓

Tool Executor

↓

UI Generator

↓

Redis Streams

↓

Express SSE Gateway

↓

Frontend
```

---

### 74. LangGraph Runtime

LangGraph is responsible for workflow orchestration.

Responsibilities:

* Planning
* State Transitions
* Interrupt
* Resume
* Conditional Routing
* Checkpoint Management

LangGraph does not execute business logic directly.

---

### 75. Planner

Planner analyzes user intent and determines execution strategy.

Responsibilities:

* Intent Analysis
* Tool Selection
* Execution Planning
* Workflow Routing

Planner outputs an execution plan rather than invoking tools directly.

---

### 76. Context Builder

Context Builder assembles all information required for reasoning.

Sources include:

* User Message
* Conversation History
* Shared State
* Memory
* Evidence
* Tool Results

The generated context is passed to the Planner and LLM.

---

### 77. Tool Execution

Tool execution is separated into two categories.

##### Synchronous Tools

Examples:

* Warranty Lookup
* Customer Lookup
* Product Lookup

Execution:

Planner

↓

Tool Executor

↓

HTTP

↓

Express

↓

Response

---

##### Asynchronous Tools

Examples:

* OCR
* Vision
* Import
* Email

Execution:

Planner

↓

Tool Executor

↓

Redis Streams

↓

Worker

↓

Resume Workflow

---

### 78. Retrieval Architecture

Knowledge retrieval follows a direct access model.

```text
Planner

↓

Retriever

↓

pgvector

↓

Relevant Chunks

↓

Reasoner
```

Business APIs are not used for semantic retrieval.

---

### Appendix B. Sequence Diagrams

---

### B.1 Agentic Chat

```text
[Sequence Diagram]
Edges: [Sync HTTPS] · [Sync Internal HTTP] · [Async Redis Streams] · [SSE]
User

↓

Frontend

↓

Express Gateway

↓

FastAPI AI Runtime

↓

Planner

↓

LLM

↓

Streaming

↓

Redis Streams

↓

Express SSE Gateway

↓

Frontend

↓

User
```

---

### B.2 RAG Workflow

```text
[Sequence Diagram]
User Question

↓

Planner

↓

Query Rewrite

↓

Embedding

↓

Vector Search

↓

Top K

↓

Re-ranking

↓

Prompt Builder

↓

LLM

↓

Evidence

↓

Response
```

---

### B.3 Tool Calling

```text
[Sequence Diagram]
Edge: [Sync Internal HTTP]
Execution Plan

↓

Tool Registry

↓

FastAPI Schema Validation

↓

Express Authentication / Authorization

↓

Express Business API

↓

Tool Result

↓

Reasoning

↓

Response
```

---

### C.2 Conversation Schema

```yaml
id:

messages:

attachments:

status:

created_at:

updated_at:
```

---

### C.6 Tool Schema

```yaml
name:

description:

permission:

input:

output:

timeout:

retry:
```

---

### C.10 Memory Schema

```yaml
short_term:

working:

semantic:

long_term:
```

---

### C.11 Workflow Schema

```yaml
id:

state:

step:

history:

interrupt:

resume:
```

---

## Design Principles

Apply the approved boundaries, ownership rules, and status classifications preserved in this handbook.

## Implementation

Implementation details remain governed by the architecture and contracts referenced above.

## Best Practices

Keep current decisions separate from Planned Evolution and Enterprise Vision material.

## Future Evolution

### Part VII. Roadmap & Future Evolution

> Unless a subsection is explicitly marked Current Decision or Planned Evolution, content in Part VII is **Enterprise Vision** and is not an implementation claim.

---

### 39. Product Evolution

#### Vision

Servexa Warranty AI hướng tới việc trở thành một **AI-native Warranty Operations Platform**, nơi AI không chỉ trả lời câu hỏi mà còn tham gia điều phối toàn bộ quy trình bảo hành.

Lộ trình phát triển được chia thành nhiều cấp độ trưởng thành nhằm giảm rủi ro và đảm bảo mỗi giai đoạn đều mang lại giá trị cho người dùng.

---

#### Capability Maturity Model

##### Current Decision — Level 1 AI Assistant

**Implementation Status:** Implemented

Khả năng:

- Chat
- RAG
- Citation
- Suggested Actions

---

##### Current Decision — Level 2 AI Copilot

**Implementation Status:** Partial

Khả năng:

- Shared State
- Workflow Awareness
- Approval
- Reasoning Trace

---

##### Planned Evolution — Level 3 AI Workflow Engine

**Implementation Status:** Planned

Khả năng:

- Workflow Automation
- Human-in-the-loop
- Streaming
- Tool Orchestration

---

##### Enterprise Vision — Level 4 AI Operations Platform

Khả năng:

- Multi-Agent
- Cross-system Integration
- Predictive Maintenance
- Enterprise Deployment

---

### 40. Enterprise Vision — Multi-Agent Evolution

#### Current Decision Baseline

Single Planner

↓

Single Runtime

↓

Single Conversation

---

#### Enterprise Vision Stage 1

Planner

↓

Retriever

↓

Reasoner

↓

UI Generator

---

#### Enterprise Vision Stage 2

Planner

↓

Specialized Agents

- Warranty Agent
- Repair Agent
- Inventory Agent
- Policy Agent

---

#### Enterprise Vision Stage 3

Supervisor Agent

↓

Multiple Domain Agents

↓

Shared State

↓

Shared Memory

---

#### Benefits

- Independent Scaling
- Better Specialization
- Lower Latency
- Better Fault Isolation

---

### 41. Enterprise Vision — Future AI Capabilities

#### Knowledge Graph

Kết nối:

- Product
- Customer
- Warranty
- Repair
- Technician

để tăng khả năng suy luận.

---

#### Long-term Memory

Agent có khả năng ghi nhớ:

- tổ chức;
- quy trình;
- lịch sử tương tác.

---

#### Adaptive Planning

Planner tự điều chỉnh workflow dựa trên:

- dữ liệu;
- loại hồ sơ;
- mức độ ưu tiên.

---

#### Autonomous Scheduling

Planner có thể đề xuất hoặc yêu cầu:

- gán kỹ thuật viên;
- đề xuất lịch sửa chữa;
- cân bằng tải.

Express luôn kiểm tra quyền/business rule và thực thi thay đổi lịch hoặc phân công.

---

#### Predictive Analytics

Bao gồm:

- Failure Prediction
- Warranty Risk
- Parts Forecast
- SLA Prediction

---

### 43. Enterprise Vision — AI Technology Roadmap

#### Enterprise Vision — MCP Integration

**Enterprise Vision:** có thể hỗ trợ:

- MCP Tool
- MCP Resource
- MCP Prompt

để Agent tương tác với hệ sinh thái chuẩn hóa.

---

#### Enterprise Vision — Agent Framework

LangGraph là workflow engine hiện tại. **Enterprise Vision evaluation** chỉ xem xét adapter hoặc migration có ADR riêng; không công nghệ nào dưới đây thay thế LangGraph trong current implementation:

- AG-UI Runtime
- OpenAI Agents SDK
- Custom Runtime

Nhờ kiến trúc Tool Registry và Shared State độc lập.

---

#### Model Routing

Hỗ trợ nhiều Model:

- GPT
- Claude
- Gemini
- Local LLM

Thông qua một Model Gateway thống nhất.

---

#### Multimodal Expansion

Bổ sung:

- Vision-language Models
- Voice Assistant
- Speech-to-Text
- Text-to-Speech
- Video Understanding

---

## References

- [Legacy source](../../documents/TECHNICAL_MASTER_PLAN.md)
- [Legacy source](../../documents/ai-runtime-policy.md)
- [Legacy source](../../documents/4.platform/DEVOPS_MASTER_PLAN.md)

## Related ADRs

- [ADR-001: AI-native architecture](../adr/ADR-001-ai-native-architecture.md)
- [ADR-005: Retrieval-Augmented Generation](../adr/ADR-005-retrieval-augmented-generation.md)
- [ADR-006: Tool Registry and Tool Calling](../adr/ADR-006-tool-registry-and-tool-calling.md)
- [ADR-008: Polyglot persistence](../adr/ADR-008-polyglot-persistence.md)
- [ADR-010: Event-driven AI runtime](../adr/ADR-010-event-driven-ai-runtime.md)

## Related Documents

- [Technical Master Plan](./TECHNICAL_MASTER_PLAN.md)
- [Roadmap Master](../roadmap/ROADMAP_MASTER.md)
- [DevOps Master Plan](../platform/DEVOPS_MASTER_PLAN.md)
- [Glossary](../glossary/GLOSSARY.md)
