import type { Prisma } from "@servexa-warranty-ai/db/prisma/client";

/** Coerce validated JSON-serializable values for Prisma JSON columns. */
export function toInputJsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}
