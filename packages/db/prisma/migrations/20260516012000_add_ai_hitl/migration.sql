-- CreateEnum
CREATE TYPE "ai_hitl_request_status" AS ENUM ('pending', 'approved', 'rejected', 'edited', 'expired', 'executed', 'failed');

-- CreateEnum
CREATE TYPE "ai_hitl_action_kind" AS ENUM ('repair_escalation', 'technician_assignment', 'customer_response_draft', 'part_order_request', 'warranty_exception');

-- CreateEnum
CREATE TYPE "ai_hitl_risk_level" AS ENUM ('low', 'medium', 'high', 'critical');

-- CreateEnum
CREATE TYPE "ai_customer_response_draft_status" AS ENUM ('draft', 'archived');

-- CreateTable
CREATE TABLE "ai_human_approval_request" (
    "id" TEXT NOT NULL,
    "kind" "ai_hitl_action_kind" NOT NULL,
    "status" "ai_hitl_request_status" NOT NULL DEFAULT 'pending',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "payload_json" JSONB NOT NULL,
    "decision_json" JSONB,
    "risk_level" "ai_hitl_risk_level",
    "confidence" DOUBLE PRECISION,
    "repair_case_id" TEXT,
    "created_by_user_id" TEXT NOT NULL,
    "decided_by_user_id" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "decided_at" TIMESTAMPTZ(3),
    "executed_at" TIMESTAMPTZ(3),
    "error_message" TEXT,

    CONSTRAINT "ai_human_approval_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_customer_response_draft" (
    "id" TEXT NOT NULL,
    "repair_case_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" "ai_customer_response_draft_status" NOT NULL DEFAULT 'draft',
    "hitl_request_id" TEXT NOT NULL,
    "created_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ai_customer_response_draft_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ai_human_approval_request_created_by_user_id_status_idx" ON "ai_human_approval_request"("created_by_user_id", "status");

-- CreateIndex
CREATE INDEX "ai_human_approval_request_repair_case_id_idx" ON "ai_human_approval_request"("repair_case_id");

-- CreateIndex
CREATE UNIQUE INDEX "ai_customer_response_draft_hitl_request_id_key" ON "ai_customer_response_draft"("hitl_request_id");

-- CreateIndex
CREATE INDEX "ai_customer_response_draft_repair_case_id_idx" ON "ai_customer_response_draft"("repair_case_id");

-- AddForeignKey
ALTER TABLE "ai_customer_response_draft" ADD CONSTRAINT "ai_customer_response_draft_hitl_request_id_fkey" FOREIGN KEY ("hitl_request_id") REFERENCES "ai_human_approval_request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
