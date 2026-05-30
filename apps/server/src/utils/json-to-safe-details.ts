import type { Prisma } from "@servexa-warranty-ai/db/prisma/client";

export function jsonToSafeDetails(
  value: Prisma.JsonValue | null | undefined,
): Prisma.JsonObject | undefined {
  // FIX: Combine the three conditions. object + not null + not array
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    // With the 3 checks above, TypeScript automatically narrows down the type 
    // of `value` to `Prisma.JsonObject`.
    // The `value` is automatically narrowed by TSC to the correct type 
    // `Prisma.JsonObject`.
    return value;
  }

  return undefined;
}
