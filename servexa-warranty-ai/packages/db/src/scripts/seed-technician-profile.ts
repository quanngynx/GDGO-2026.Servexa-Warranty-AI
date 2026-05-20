/**
 * Upserts demo technician user + profile for HITL technician_assignment flows.
 * Run from packages/db: pnpm exec tsx src/scripts/seed-technician-profile.ts
 */
import path from "node:path";
import { config } from "dotenv";

config({ path: path.resolve(process.cwd(), "../../apps/server/.env") });

async function main() {
  const { seedHumanResources } = await import("../seeds/human-resources");
  await seedHumanResources();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
