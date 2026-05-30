import type { HitlActionKind } from "@servexa-warranty-ai/ai-contracts";

/** Permission keys for HITL workflow kinds (align with identity matrix). */
export const HITL_KIND_PERMISSIONS: Record<
  "repair_escalation" | "technician_assignment" | "customer_response_draft",
  string
> = {
  repair_escalation: "repair_case.update",
  technician_assignment: "repair_case.assign",
  customer_response_draft: "customer_response.create",
};

export const HITL_CREATE_ANY_PERMISSIONS = Object.values(HITL_KIND_PERMISSIONS);

export function permissionForHitlKind(
  kind: HitlActionKind,
): string | undefined {
  if (kind in HITL_KIND_PERMISSIONS) {
    return HITL_KIND_PERMISSIONS[kind as keyof typeof HITL_KIND_PERMISSIONS];
  }
  return undefined;
}

export function userHasPermission(permissions: string[], required: string): boolean {
  if (permissions.includes("*")) return true;
  return permissions.includes(required);
}

export function userHasAnyPermission(permissions: string[], required: string[]): boolean {
  if (permissions.includes("*")) return true;
  return required.some((p) => permissions.includes(p));
}
