import type { RequestHandler } from 'express'

import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant'
import { Roles } from '@/enums/roles'
import { createOperationalError } from '@/middlewares/error-middleware'

export const requireRoles = (allowedRoles: Roles[]): RequestHandler => {
  return (req, _res, next) => {
    const userRole = req.user?.role

    if (!userRole) {
      return next(
        createOperationalError(
          'Authentication required',
          HTTP_RESPONSE_CODE.UNAUTHORIZED,
        ),
      )
    }

    if (!allowedRoles.includes(userRole)) {
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
