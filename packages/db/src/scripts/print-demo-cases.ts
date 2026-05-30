import path from "node:path";
import { config } from "dotenv";

const envPath = path.resolve(process.cwd(), "../../apps/server/.env");
config({ path: envPath });

const { default: prisma } = await import("../index");

const DEMO_CASE_NUMBERS = ["RC-2024-000001", "RC-2024-000002", "RC-2024-000003"];

async function main() {
  const cases = await prisma.repairCase.findMany({
    where: { caseNumber: { in: DEMO_CASE_NUMBERS } },
    select: {
      id: true,
      caseNumber: true,
      status: true,
      priority: true,
      promisedDeliveryDate: true,
    },
    orderBy: { caseNumber: "asc" },
  });

  const hitlCount = await prisma.aiHumanApprovalRequest.count({
    where: { status: "pending" },
  });
  const knowledgeCount = await prisma.aiKnowledgeChunk.count();

  console.log("\n=== Phase 1–2 demo data ===\n");
  console.log(`Repair cases (sample): ${cases.length}`);
  for (const c of cases) {
    const slaRisk =
      c.promisedDeliveryDate && c.promisedDeliveryDate < new Date() ? " [SLA risk]" : "";
    console.log(
      `  · ${c.caseNumber}  id=${c.id}  status=${c.status}  priority=${c.priority}${slaRisk}`,
    );
  }
  if (cases.length === 0) {
    console.log("  (none — run: pnpm db:seed)");
  }

  console.log(`\nPending HITL requests: ${hitlCount}`);
  if (knowledgeCount >= 0) {
    console.log(
      `AI knowledge chunks: ${knowledgeCount}${knowledgeCount === 0 ? " (RAG evidence may be empty)" : ""}`,
    );
  }

  console.log("\nLogin: admin / Admin@123");
  console.log("Copilot: http://localhost:3001/ai/gemini");
  console.log("Repair cases: http://localhost:3001/repair-cases-management\n");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
