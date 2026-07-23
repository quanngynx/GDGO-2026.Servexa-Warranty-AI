# AI and copilot systems

## What the AI stack does

The repository’s AI stack supports three related capabilities:

1. **knowledge ingestion and retrieval** for RAG
2. **agent/coordinator workflows** for operations and supply-chain assistance
3. **human-in-the-loop (HITL)** approvals, reasoning traces, and copilot UX

This is implemented across both the Node server and the Python AI service.

## Node-side AI API surface

The main AI router is `/apps/server/src/modules/v1/ai/router/route.ts`.

It exposes routes for:

- query and job submission
- knowledge ingestion / reindex / search
- workflows, tools, and coordination
- ops summary
- reasoning traces
- HITL actions

Notable route shapes:

- `POST /v1/ai/query`
- `POST /v1/ai/jobs`
- `POST /v1/ai/knowledge/ingest-text`
- `POST /v1/ai/knowledge/ingest-document`
- `POST /v1/ai/knowledge/reindex`
- `GET /v1/ai/knowledge/search`
- `POST /v1/ai/workflows/step`
- `GET /v1/ai/tools`
- `POST /v1/ai/tools/invoke`
- `POST /v1/ai/agents/coordinate`
- `GET /v1/ai/ops/summary`

Most of these are authenticated. The main exception is an internal worker-only ingest endpoint guarded by a dedicated secret header.

## RAG knowledge ingestion

### Ingestion sources and normalization

`KnowledgeIngestionService` (`/apps/server/src/modules/v1/ai/services/knowledge-ingestion.service.ts`) can ingest:

- plain text
- PDF
- DOCX
- XLSX
- HTML

It converts supported document formats to text, normalizes line endings, chunks content, computes content hashes, and avoids duplicate ready-state documents when the same content hash is already present.

### Chunking strategy

The service uses two chunking styles:

- a paragraph-aware fixed-width helper
- a recursive splitter that prefers `\n\n`, `\n`, sentence, then space boundaries

The active ingest path uses `chunkRecursive(..., MAX_CHUNK_CHARS)` with `MAX_CHUNK_CHARS = 1200`.

### Embeddings and storage

Embeddings are created with Google `text-embedding-004` through the AI SDK. The service expects **768-dimensional vectors** and writes them into `pgvector` columns in `ai_knowledge_chunks`.

This is one of the most important design facts in the repo:

- the vector store is not a separate SaaS product
- it is stored in the primary PostgreSQL database via `pgvector`

### Internal ingest path

`knowledge.controller.ts` includes `internalIngest`, intended for worker use only, protected by `x-internal-ingest-key` matching `AI_INTERNAL_INGEST_SECRET`.

That endpoint exists so async workers can push knowledge-ingest jobs back through the Node-side ingestion pipeline without exposing a public unauthenticated path.

## RAG retrieval

`KnowledgeRetrievalService` (`/apps/server/src/modules/v1/ai/services/knowledge-retrieval.service.ts`) performs a hybrid retrieval strategy:

- embed the query with Google `text-embedding-004`
- run vector similarity against `ai_knowledge_chunks`
- add a cheap lexical `ILIKE` signal
- order by vector distance with a lexical boost
- rerank with an explicit hybrid score
- compress text context around the query before returning it

There is also a short in-memory cache with a 60-second TTL.

This means the repository’s RAG design is **hybrid and pragmatic**, not purely semantic.

## HITL and governance

### What HITL is used for

The system supports formal approval workflows for AI-proposed actions. Current supported kinds include:

- `repair_escalation`
- `technician_assignment`
- `customer_response_draft`

(`HitlService` in `/apps/server/src/modules/v1/ai/services/hitl.service.ts`)

### Enforcement behavior

The HITL service handles:

- request creation
- duplicate detection for graph-thread-linked requests
- permission checks for creation/view/decision
- ASC center access policy checks for repair-case-linked actions
- stale pending expiry based on configured TTL
- approval / rejection / edited-payload decisions
- audit logging and event publishing
- resume hooks back into graph execution

This is not just UI review; it is policy-aware workflow control.

## Python coordinator and agent routing

The best single file for the Python-side orchestration model is:

- `/apps/ai-services/src/modules/v1/agents/services/coordinator_service.py`

### Graph structure

The coordinator builds a LangGraph state machine with nodes roughly equivalent to:

- `route`
- `approval_gate`
- `supply_chain`
- `operations`
- `finalize`

### Route selection

Current route selection is simple and explicit:

- messages mentioning `stock` or `restock` go to `supply_chain`
- everything else defaults to `operations`

This is important for future agents: current routing is intentionally lightweight and keyword-based, not a full planner.

### Approval interruptions

If execution context indicates approval is needed, the graph calls `interrupt(...)` and returns a payload containing a proposed action and `thread_id`. Resume is later handled with a LangGraph `Command(resume=...)`.

### Checkpointing

The coordinator defaults to an in-memory saver, but can switch to a Postgres checkpointer when `LANGGRAPH_CHECKPOINT_POSTGRES` is enabled.

### Reasoning traces

The coordinator emits structured trace steps such as:

- run start/completion
- route selection
- tool or workflow execution
- waiting-for-human states

These traces are then relevant to the web copilot rail and backend trace endpoints.

## Web copilot UX

The full-page copilot entry is `/apps/web/src/features/ai-copilot/ai-copilot-full-page.tsx`.

It renders:

- a dedicated “Operations Intelligence” header
- the main chat area
- a right-side context/approval panel
- links to retry/error handling hooks and source metadata

The UI text explicitly describes the side panel as **“evidence & approvals in the context panel”**, which is a concise summary of the product intent.

Recent git history (`c41ee8d`, `52321cc`) shows this area is under active refinement.

## Operational visibility

The AI ops summary endpoint (`/apps/server/src/modules/v1/ai/controllers/ops.controller.ts`) exposes a useful runtime snapshot:

- whether RAG context is enabled
- top-K setting
- OTEL status
- whether Langfuse keys are configured
- AI stream names
- registered tools

That endpoint is a good first debugging stop for future agents investigating AI runtime behavior.

## Related workflow model

The repo also contains lightweight workflow definitions such as `warranty_claim_intake` in `/apps/server/src/modules/v1/workflows/warranty-claim-intake.ts`.

This suggests the system is evolving toward explicit machine-readable business workflows that AI actions can integrate with or trigger.

## What to inspect first when changing AI behavior

### If changing ingestion/retrieval

Start with:

- `/apps/server/src/modules/v1/ai/controllers/knowledge.controller.ts`
- `/apps/server/src/modules/v1/ai/services/knowledge-ingestion.service.ts`
- `/apps/server/src/modules/v1/ai/services/knowledge-retrieval.service.ts`
- `/apps/server/prisma/schema/schema.prisma`

### If changing approvals/HITL

Start with:

- `/apps/server/src/modules/v1/ai/services/hitl.service.ts`
- `/apps/server/src/modules/v1/ai/hitl/*`
- `/apps/server/src/modules/v1/ai/router/hitl.route.ts`
- relevant permission and ASC access policy files

### If changing coordinator behavior

Start with:

- `/apps/ai-services/src/modules/v1/agents/services/coordinator_service.py`
- `/apps/ai-services/src/modules/v1/agents/services/operations_service.py`
- `/apps/ai-services/src/modules/v1/agents/services/supply_chain_service.py`
- `/apps/ai-services/src/modules/v1/agents/tools/*`

### If changing the operator experience

Start with:

- `/apps/web/src/features/ai-copilot/*`
- `/apps/web/src/features/ai/components/*`
- `/apps/server/src/modules/copilotkit/*`

## Source anchors

- `/apps/server/src/modules/v1/ai/router/route.ts`
- `/apps/server/src/modules/v1/ai/controllers/knowledge.controller.ts`
- `/apps/server/src/modules/v1/ai/controllers/ops.controller.ts`
- `/apps/server/src/modules/v1/ai/services/knowledge-ingestion.service.ts`
- `/apps/server/src/modules/v1/ai/services/knowledge-retrieval.service.ts`
- `/apps/server/src/modules/v1/ai/services/hitl.service.ts`
- `/apps/server/src/modules/v1/workflows/warranty-claim-intake.ts`
- `/apps/web/src/features/ai-copilot/ai-copilot-full-page.tsx`
- `/apps/ai-services/src/main.py`
- `/apps/ai-services/src/modules/v1/rag/services/rag_service.py`
- `/apps/ai-services/src/modules/v1/agents/services/coordinator_service.py`
