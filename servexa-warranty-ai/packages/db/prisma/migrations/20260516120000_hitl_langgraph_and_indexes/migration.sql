-- AlterTable
ALTER TABLE "ai_human_approval_request" ADD COLUMN IF NOT EXISTS "lang_graph_thread_id" TEXT;
ALTER TABLE "ai_human_approval_request" ADD COLUMN IF NOT EXISTS "lang_graph_run_id" TEXT;
ALTER TABLE "ai_human_approval_request" ADD COLUMN IF NOT EXISTS "lang_graph_checkpoint_id" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ai_human_approval_request_status_idx" ON "ai_human_approval_request"("status");
CREATE INDEX IF NOT EXISTS "ai_human_approval_request_kind_idx" ON "ai_human_approval_request"("kind");
CREATE INDEX IF NOT EXISTS "ai_human_approval_request_created_at_idx" ON "ai_human_approval_request"("created_at");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ai_human_approval_request_repair_case_id_fkey'
  ) THEN
    ALTER TABLE "ai_human_approval_request"
      ADD CONSTRAINT "ai_human_approval_request_repair_case_id_fkey"
      FOREIGN KEY ("repair_case_id") REFERENCES "repair_cases"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
