import { PermissionStrategy as PermissionStrategyEnum } from '@/enums/permission-strategy';
import { PermissionFactory, type PermissionStrategyTypes } from './permission-factory.service';

export class PermissionService {
  private strategy;

  constructor(private factory: PermissionFactory) {
    const model =
      (process.env.PERMISSION_MODEL as PermissionStrategyTypes) ||
      PermissionStrategyEnum.RBAC_HIERARCHICAL;
    this.strategy = this.factory.getStrategy(model);
  }

  async hasPermission(
    userId: string,
    permission: string,
    context?: Record<string, any>,
  ): Promise<boolean> {
    return await this.strategy.hasPermission(userId, permission, context);
  }
}
