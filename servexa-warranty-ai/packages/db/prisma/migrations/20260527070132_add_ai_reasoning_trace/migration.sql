-- CreateEnum
CREATE TYPE "reasoning_trace_step_type" AS ENUM ('run', 'routing', 'retrieval', 'rerank', 'tool', 'hitl', 'workflow', 'generation', 'finalization', 'error');

-- CreateEnum
CREATE TYPE "reasoning_trace_status" AS ENUM ('pending', 'running', 'completed', 'failed', 'skipped', 'waiting_for_human');

-- CreateTable
CREATE TABLE "ai_reasoning_traces" (
    "id" TEXT NOT NULL,
    "trace_id" TEXT NOT NULL,
    "run_id" TEXT,
    "thread_id" TEXT,
    "status" "reasoning_trace_status" NOT NULL DEFAULT 'running',
    "started_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMPTZ(3),
    "repair_case_id" TEXT,
    "created_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ai_reasoning_traces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_reasoning_trace_events" (
    "id" TEXT NOT NULL,
    "trace_id" TEXT NOT NULL,
    "step_id" TEXT NOT NULL,
    "parent_step_id" TEXT,
    "type" "reasoning_trace_step_type" NOT NULL,
    "status" "reasoning_trace_status" NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "error_message" TEXT,
    "started_at" TIMESTAMPTZ(3),
    "ended_at" TIMESTAMPTZ(3),
    "duration_ms" INTEGER,
    "agent_name" TEXT,
    "tool_name" TEXT,
    "workflow_kind" TEXT,
    "hitl_request_id" TEXT,
    "safe_details" JSONB,
    "evidence_source_ids" TEXT[],
    "related_entity_ids" TEXT[],
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ai_reasoning_trace_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_file_versions" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "checksum" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_file_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ai_reasoning_traces_trace_id_key" ON "ai_reasoning_traces"("trace_id");

-- CreateIndex
CREATE INDEX "ai_reasoning_traces_trace_id_idx" ON "ai_reasoning_traces"("trace_id");

-- CreateIndex
CREATE INDEX "ai_reasoning_traces_run_id_idx" ON "ai_reasoning_traces"("run_id");

-- CreateIndex
CREATE INDEX "ai_reasoning_traces_thread_id_idx" ON "ai_reasoning_traces"("thread_id");

-- CreateIndex
CREATE INDEX "ai_reasoning_traces_created_by_user_id_status_idx" ON "ai_reasoning_traces"("created_by_user_id", "status");

-- CreateIndex
CREATE INDEX "ai_reasoning_traces_repair_case_id_idx" ON "ai_reasoning_traces"("repair_case_id");

-- CreateIndex
CREATE INDEX "ai_reasoning_trace_events_trace_id_status_idx" ON "ai_reasoning_trace_events"("trace_id", "status");

-- CreateIndex
CREATE INDEX "ai_reasoning_trace_events_type_idx" ON "ai_reasoning_trace_events"("type");

-- CreateIndex
CREATE INDEX "ai_reasoning_trace_events_started_at_idx" ON "ai_reasoning_trace_events"("started_at");

-- CreateIndex
CREATE UNIQUE INDEX "ai_reasoning_trace_events_trace_id_step_id_key" ON "ai_reasoning_trace_events"("trace_id", "step_id");

-- CreateIndex
CREATE INDEX "document_file_versions_documentId_idx" ON "document_file_versions"("documentId");

-- AddForeignKey
ALTER TABLE "ai_reasoning_trace_events" ADD CONSTRAINT "ai_reasoning_trace_events_trace_id_fkey" FOREIGN KEY ("trace_id") REFERENCES "ai_reasoning_traces"("trace_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_file_versions" ADD CONSTRAINT "document_file_versions_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_file_versions" ADD CONSTRAINT "document_file_versions_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
