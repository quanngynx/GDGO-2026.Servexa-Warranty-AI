/**
 * Route-level permission keys (resource.action).
 * Must exist in the `permission` table and be assigned to roles via `role_permission`.
 */
export const RoutePermissions = {
  users: {
    read: 'users.read',
    write: 'users.write',
    delete: 'users.delete',
    restore: 'users.restore',
  },
  roles: {
    read: 'roles.read',
    write: 'roles.write',
  },
  permissions: {
    read: 'permissions.read',
    write: 'permissions.write',
  },
  repairCase: {
    read: 'repair_case.read',
    write: 'repair_case.write',
    update: 'repair_case.update',
    assign: 'repair_case.assign',
  },
  payment: {
    read: 'payment.read',
    write: 'payment.write',
  },
  ascCenter: {
    read: 'asc_center.read',
    write: 'asc_center.write',
  },
  accessoryRequest: {
    read: 'accessory_request.read',
    write: 'accessory_request.write',
  },
  stocktake: {
    read: 'stocktake.read',
    write: 'stocktake.write',
  },
  voucher: {
    read: 'voucher.read',
    write: 'voucher.write',
  },
  catalog: {
    read: 'catalog.read',
    write: 'catalog.write',
    import: 'catalog.import',
    export: 'catalog.export',
  },
  document: {
    read: 'document.read',
    write: 'document.write',
    delete: 'document.delete',
  },
} as const
