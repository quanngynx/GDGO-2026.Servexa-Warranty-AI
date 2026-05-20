import type { NextFunction, Request, Response } from 'express';

import { PermissionService } from '../services/permission.service';
import { createOperationalError } from '@/middlewares/error-middleware';
import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant';
import { ErrorHandler } from '@/core/helpers/error-handling.helper';
import logger from '@/core/logging/logging.config';
import { getRequestInfo } from '@/core/logging/logging.utils';
import { requestPermissionCheckSchema } from '../validations/permission';
import { SuccessResponse } from '@/utils/success-response';
import { PermissionFactory } from '../services/permission-factory.service';
import { RbacHierarchicalStrategy } from '../services/rbac-hierarchical.service';
import { UserRoleRepository } from '../repositories/user-role.repository';
import { RoleClosureRepository } from '../repositories/role-closure.repository';
import { RolePermissionRepository } from '../repositories/role-permission.repository';

class PermissionController {
  errorHandler: ErrorHandler
  permissionService: PermissionService

  constructor() {
    this.errorHandler = ErrorHandler.getInstance()
    this.permissionService = new PermissionService(
      new PermissionFactory(
        new RbacHierarchicalStrategy(
          new UserRoleRepository(),
          new RoleClosureRepository(),
          new RolePermissionRepository(),
        )
      )
    )
  }

  checkPermission = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Checking permission', {
        ...getRequestInfo(req, 'PermissionController.checkPermission'),
      })

      const { permission, context } = requestPermissionCheckSchema.parse(req.body)

      if (!req.user) {
        throw createOperationalError('Authentication required!', HTTP_RESPONSE_CODE.UNAUTHORIZED);
      }

      const userId = req.user.id;
      const hasPermission = await this.permissionService.hasPermission(
        userId,
        permission,
        context,
      );

      return new SuccessResponse({
        message: 'Permission check completed successfully!',
        metadata: {
          hasPermission,
          permission,
          userId,
        },
      });
    })(req, res, next);
  }
}

export default new PermissionController();
