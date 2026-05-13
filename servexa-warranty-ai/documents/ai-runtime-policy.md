# AI runtime policy (Phase 1–2)

This document encodes [servexa_warranty_ai_plan_revision_recommendations_report.md](../servexa_warranty_ai_plan_revision_recommendations_report.md) and the Phase 1–2 execution plan. **Do not duplicate orchestration in Node** once the Python path carries full execution context.

## Runtime ownership

| Layer | Role |
|-------|------|
| **Node (`apps/server`)** | API gateway, authentication, validation, **orchestration entrypoint only**, publishing to Redis, gRPC client to Python, optional **lightweight** Node Gemini fallback when gRPC is unavailable and policy allows. |
| **Python (`apps/ai-services`)** | **Single orchestration authority**: LangGraph coordinator, tool execution, async job handling from Redis, gRPC `ai.v1.AiService` implementation. |

## Runtime mode (sync vs async)

**MUST be async** (Redis job → worker → Python): document ingestion at scale, report generation, summarization pipelines, bulk retrieval, multi-step / long-running reasoning, background enrichment.

**MAY be sync** (unary gRPC / short Node path): lightweight chat, autocomplete, short RAG-augmented Q&A, simple classification, explicitly allowlisted low-latency routes.

Encoding: see `apps/server/src/modules/v1/ai/runtime/ai-runtime-routing.ts` and job type routing in `AiJobStreamService`.

## Memory stance

- **Default:** stateless HTTP/gRPC handling; no durable conversational memory in Phase 1–2.
- **Ephemeral Redis only:** job metadata, dedupe keys, optional cancel flags — always with explicit TTL (e.g. 86_400 seconds) documented in code.
- **Deferred:** persistent memory / workflow state until Phase 3+.

## Contracts

- Unary: `packages/proto/ai/v1/ai_service.proto` (`request_version`, `job_id`, `job_type`, `execution_context_json`).
- Streams: `packages/event-contracts` Zod schemas; DLQ payloads must match `aiJobDlqEnvelopeSchema`.

## RAG corpus

- **Canonical:** Prisma `ai_knowledge_*` (used by Node retrieval and ingestion).
- **Non-product:** LangChain `PGVector` under `apps/ai-services` is experimental / isolated — see `apps/ai-services/src/modules/v1/rag/README.md`.
