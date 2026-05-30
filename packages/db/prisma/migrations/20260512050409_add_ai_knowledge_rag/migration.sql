-- Enable pgvector (no-op if already present)
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateEnum
CREATE TYPE "AiKnowledgeDocumentStatus" AS ENUM ('pending', 'processing', 'ready', 'failed');

-- CreateTable
CREATE TABLE "ai_knowledge_documents" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "document_scope" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "source_uri" TEXT,
    "mime_type" TEXT,
    "content_hash" TEXT NOT NULL,
    "document_version" INTEGER NOT NULL DEFAULT 1,
    "status" "AiKnowledgeDocumentStatus" NOT NULL DEFAULT 'pending',
    "ingested_at" TIMESTAMPTZ(3),
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ai_knowledge_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_knowledge_chunks" (
    "id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "chunk_index" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "chunk_hash" TEXT NOT NULL,
    "embedding_model" TEXT NOT NULL,
    "embedding_version" TEXT NOT NULL,
    "embedding" vector(768),
    "token_count" INTEGER,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_knowledge_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ai_knowledge_documents_tenant_id_document_scope_idx" ON "ai_knowledge_documents"("tenant_id", "document_scope");

-- CreateIndex
CREATE INDEX "ai_knowledge_documents_tenant_id_status_idx" ON "ai_knowledge_documents"("tenant_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ai_knowledge_documents_tenant_id_content_hash_document_vers_key" ON "ai_knowledge_documents"("tenant_id", "content_hash", "document_version");

-- CreateIndex
CREATE INDEX "ai_knowledge_chunks_tenant_id_embedding_model_idx" ON "ai_knowledge_chunks"("tenant_id", "embedding_model");

-- CreateIndex
CREATE INDEX "ai_knowledge_chunks_chunk_hash_idx" ON "ai_knowledge_chunks"("chunk_hash");

-- CreateIndex
CREATE UNIQUE INDEX "ai_knowledge_chunks_document_id_chunk_index_key" ON "ai_knowledge_chunks"("document_id", "chunk_index");

-- AddForeignKey
ALTER TABLE "ai_knowledge_chunks" ADD CONSTRAINT "ai_knowledge_chunks_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "ai_knowledge_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
