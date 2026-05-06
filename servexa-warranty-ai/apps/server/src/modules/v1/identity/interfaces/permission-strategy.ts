export interface PermissionStrategy {
  hasPermission(
    userId: string,
    permissionName: string,
    context?: Record<string, any>,
  ): Promise<boolean>;

  /**
   * Optional: load cache or precompute
   */
  warmup?(): Promise<void>;
}
