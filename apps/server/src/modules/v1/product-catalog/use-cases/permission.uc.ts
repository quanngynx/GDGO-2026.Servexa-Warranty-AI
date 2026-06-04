import { RoutePermissions } from '@/core/constants/route-permissions'
import { requireRoutePermissions } from '@/middlewares/authz.middleware'
import type { RequestHandler } from 'express'

const C = RoutePermissions.catalog

export const catalogRead: RequestHandler = requireRoutePermissions([C.read])
export const catalogWrite: RequestHandler = requireRoutePermissions([C.write])
export const catalogImport: RequestHandler = requireRoutePermissions([C.import])
export const catalogExport: RequestHandler = requireRoutePermissions([C.export])
