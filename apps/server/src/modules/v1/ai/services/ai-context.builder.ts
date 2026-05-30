import type { Request } from "express";

/** RBAC / tenant context injected into AI calls (proposal §20–21). */
export function buildAiContextJson(req: Request, extras?: Record<string, unknown>): string {
  const user = req.user;
  const base: Record<string, unknown> = {
    requestId: req.requestId,
    ...(extras ?? {}),
  };

  if (user) {
    base.userId = user.id;
    base.email = user.email;
    base.role = user.role;
    base.roleScope = user.roleScope;
    base.permissions = user.permissions;
  }

  return JSON.stringify(base);
}
