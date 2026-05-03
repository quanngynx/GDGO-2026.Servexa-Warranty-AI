import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant'
import { createOperationalError } from '@/middlewares/error-middleware'
import logger from '@/core/logging/logging.config'
import type { NextFunction, Request, RequestHandler, Response } from 'express'

import { UserRoleRepository } from '@/modules/v1/identity/repositories/user-role.repository'
import { RoleClosureRepository } from '@/modules/v1/identity/repositories/role-closure.repository'
import { RolePermissionRepository } from '@/modules/v1/identity/repositories/role-permission.repository'
import { PermissionCacheService } from '@/modules/v1/identity/services/permission-cache.service'
import { PermissionResolverService } from '@/modules/v1/identity/services/permission-resolver.service'

// Singleton resolver — repositories and cache service are stateless, safe to share
const permissionResolverService = new PermissionResolverService(
  new UserRoleRepository(),
  new RoleClosureRepository(),
  new RolePermissionRepository(),
  new PermissionCacheService(),
)

/**
 * Resolves and attaches the effective permission set for the authenticated user.
 *
 * Must be placed AFTER `authenticateMiddleware` (which sets req.user).
 * Sets `req.user.permissions` from Redis cache or DB (ancestor role traversal).
 *
 * @example
 * router.get('/resource', authenticateMiddleware, resolvePermissions, requirePermissions(['resource.read']), handler)
 */
export const resolvePermissions: RequestHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id

    if (!userId) {
      return next(
        createOperationalError(
          'Authentication required',
          HTTP_RESPONSE_CODE.UNAUTHORIZED,
        ),
      )
    }

    const permissions = await permissionResolverService.resolveForUser(userId)
    req.user.permissions = permissions

    logger.debug(`[resolvePermissions] userId=${userId} permissions=[${permissions.join(', ')}]`)

    return next()
  } catch (error) {
    logger.error('[resolvePermissions] Failed to resolve permissions', {
      error: error instanceof Error ? error.message : String(error),
    })
    return next(error)
  }
}

export type RequirePermissionsOptions = {
  /** 'all' — user must have every listed permission (default). 'any' — user needs at least one. */
  mode?: 'all' | 'any'
}

/**
 * Guards a route by checking resolved permissions on `req.user.permissions`.
 * Must be placed AFTER `resolvePermissions`.
 *
 * Wildcard `'*'` in the user's permission set bypasses all checks (admin).
 *
 * @example
 * requirePermissions(['users.read'])
 * requirePermissions(['users.read', 'users.write'], { mode: 'any' })
 */
export const requirePermissions = (
  allowedPermissions: string[],
  options?: RequirePermissionsOptions,
): RequestHandler => {
  const mode = options?.mode ?? 'all'

  return (req: Request, _res: Response, next: NextFunction) => {
    const userPermissions = req.user?.permissions

    if (!userPermissions) {
      return next(
        createOperationalError(
          'Authentication required',
          HTTP_RESPONSE_CODE.UNAUTHORIZED,
        ),
      )
    }

    // Admin wildcard — bypass all checks
    if (userPermissions.includes('*')) return next()

    const granted =
      mode === 'any'
        ? allowedPermissions.some((p) => userPermissions.includes(p))
        : allowedPermissions.every((p) => userPermissions.includes(p))

    if (!granted) {
      return next(
        createOperationalError(
          'Insufficient permissions',
          HTTP_RESPONSE_CODE.FORBIDDEN,
        ),
      )
    }

    return next()
  }
}