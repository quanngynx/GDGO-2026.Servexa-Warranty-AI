import { PermissionStrategy as PermissionStrategyEnum } from '@/enums/permission-strategy';
import type { PermissionStrategy } from '../interfaces';
import type { RbacHierarchicalStrategy } from './rbac-hierarchical.service';

export type PermissionStrategyTypes = PermissionStrategyEnum;

export class PermissionFactory {
  constructor(private rbacStrategy: RbacHierarchicalStrategy) {}

  getStrategy(strategy: PermissionStrategyTypes): PermissionStrategy {
    switch (strategy) {
      case PermissionStrategyEnum.RBAC_HIERARCHICAL:
        return this.rbacStrategy;
      default:
        return this.rbacStrategy;
    }
  }
}
