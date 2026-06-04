import type { RequestHandler } from 'express'

import { authenticateMiddleware } from './authenticate.middleware'
import {
  requirePermissions,
  resolvePermissions,
  type RequirePermissionsOptions,
} from './require-permission.middleware'

/** Authenticate + resolve DB-backed permissions onto `req.user`. */
export const authenticatedWithPermissions: RequestHandler[] = [
  authenticateMiddleware,
  resolvePermissions,
]

export function requireRoutePermissions(
  allowedPermissions: string[],
  options?: RequirePermissionsOptions,
): RequestHandler {
  return requirePermissions(allowedPermissions, options)
}
