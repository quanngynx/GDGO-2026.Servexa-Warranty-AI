import type { HitlActionKind } from "@servexa-warranty-ai/ai-contracts";
import type { AiHitlActionKind } from "@servexa-warranty-ai/db/prisma/client";

import { customerResponseDraftHandler } from "@/modules/v1/ai/hitl/handlers/customer-response-draft.handler";
import { repairEscalationHandler } from "@/modules/v1/ai/hitl/handlers/repair-escalation.handler";
import { technicianAssignmentHandler } from "@/modules/v1/ai/hitl/handlers/technician-assignment.handler";

export type HitlHandlerContext = {
  userId: string;
  requestId: string;
};

export type HitlHandler = (
  payload: Record<string, unknown>,
  ctx: HitlHandlerContext,
) => Promise<Record<string, unknown>>;

const REGISTRY: Partial<Record<HitlActionKind, HitlHandler>> = {
  repair_escalation: async (payload, ctx) =>
    repairEscalationHandler(payload, ctx.userId),
  technician_assignment: async (payload, ctx) =>
    technicianAssignmentHandler(payload, ctx.userId),
  customer_response_draft: async (payload, ctx) =>
    customerResponseDraftHandler(payload, ctx.userId, ctx.requestId),
};

export function getHitlHandler(kind: HitlActionKind): HitlHandler {
  const handler = REGISTRY[kind];
  if (!handler) {
    throw new Error(`UNKNOWN_HITL_ACTION:${kind}`);
  }
  return handler;
}

export function isRegisteredHitlKind(kind: string): kind is AiHitlActionKind {
  return kind in REGISTRY;
}

export const REGISTERED_HITL_KINDS = Object.keys(REGISTRY) as HitlActionKind[];
