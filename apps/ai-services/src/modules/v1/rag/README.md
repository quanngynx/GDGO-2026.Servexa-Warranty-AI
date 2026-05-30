# RAG modules (LangChain / PGVector)

**Product RAG** for Servexa Warranty AI uses Prisma models `ai_knowledge_*` and Node `KnowledgeIngestionService` / `KnowledgeRetrievalService` (see `apps/server`).

The LangChain `PGVector` stack in this folder (`vectorstores/pgvector_vectorstore.py`, `ingestion_service.py`, `pgvector_retriever.py`) is **non-canonical** and retained only for experiments or local demos. Do not route production user traffic or warranty corpus writes through it without an explicit architecture decision (see `documents/ai-runtime-policy.md`).
