export enum PermissionAction {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  IMPORT = "import",
  EXPORT = "export",
  PRINT = "print",
  VERIFY = "verify",
  APPROVE = "approve",
  REJECT = "reject",
  CANCEL = "cancel",
  RESTORE = "restore",
  MANAGE = "manage", // for all actions
  VIEW = "view",
  EDIT = "edit",
}

export enum PermissionResource {
  USERS = "users",
  INVENTORY = "inventory",
  WAREHOUSE = "warehouse",
  ANALYTICS = "analytics",
  ADMIN = "admin",
  SYSTEM = "system",
  NOTIFICATIONS = "notifications",
  BROADCASTS = "broadcasts",
}
