import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "@servexa-warranty-ai/env/server";

import { PrismaClient } from "../../prisma/generated/client";

export function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: env.DATABASE_URL,
  });
  return new PrismaClient({ adapter });
}
