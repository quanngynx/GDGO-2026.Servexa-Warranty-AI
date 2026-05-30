import type { NextFunction, Request, Response } from 'express';

// import { Roles as RolesEnum } from '@/enums/roles';

import { RoleService } from '../services/role.service';

import {
  addParentToRoleSchema,
  deleteParentFromRoleSchema,
  findAllRolesSchema,
  findByIdSchema,
  findChildrenRolesSchema,
  findParentsRolesSchema,
  roleCreationSchema,
} from '../validations/role';

// import type {
//   AddParentToRoleDto,
//   DeleteParentFromRoleDto,
//   FindAllRolesDto,
//   FindByIdDto,
//   FindChildrenRolesDto,
//   FindParentsRolesDto,
//   RoleCreationDto,
// } from '../dtos/role.dto';
import { SuccessResponse } from '@/utils/success-response';
import { ErrorHandler } from '@/core/helpers/error-handling.helper';
import logger from '@/core/logging/logging.config';
import { getRequestInfo } from '@/core/logging/logging.utils';
// import { ExtractPagination } from '@/utils/extract-pagination';
// import { RoleRepository } from '../repositories/role.repository';
// import { RoleClosureRepository } from '../repositories/role-closure.repository';

class RoleController {
  errorHandler: ErrorHandler

  constructor(private roleService: RoleService) {
    this.errorHandler = ErrorHandler.getInstance()
  }

  findAllRoles = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching roles', {
        ...getRequestInfo(req, 'RoleController.findAllRoles'),
      })

      const query = findAllRolesSchema.parse(req.query)
      const result = await this.roleService.findAllRoles(query)

      new SuccessResponse({
        message: 'Roles fetched successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  getRoleTree = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching role tree', {
        ...getRequestInfo(req, 'RoleController.getRoleTree'),
      })

      const result = await this.roleService.getRoleTree()

      new SuccessResponse({
        message: 'Role tree fetched successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  findOneById = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching role details', {
        ...getRequestInfo(req, 'RoleController.findOneById'),
      })

      const { roleId } = findByIdSchema.parse(req.params)
      const result = await this.roleService.findOneById(roleId)
    
      new SuccessResponse({
        message: 'Role fetched successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  findParentsByRoleId = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching parent roles', {
        ...getRequestInfo(req, 'RoleController.findParentsByRoleId'),
      })

      const { roleId } = findParentsRolesSchema.parse(req.params)
      const result = await this.roleService.findParentsByRoleId(roleId)
    
      new SuccessResponse({
        message: 'Parents roles fetched successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  findChildrenByRoleId = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching children roles', {
        ...getRequestInfo(req, 'RoleController.findChildrenByRoleId'),
      })

      const { roleId } = findChildrenRolesSchema.parse(req.params)
      const result = await this.roleService.findChildrenByRoleId(roleId)
    
      new SuccessResponse({
        message: 'Children roles fetched successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  createRole = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Creating role', {
        ...getRequestInfo(req, 'RoleController.createRole'),
      })

      const body = roleCreationSchema.parse(req.body)
      const result = await this.roleService.createRole(body)
    
      new SuccessResponse({
        message: 'Role created successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  addParentToRole = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Adding parent to role', {
        ...getRequestInfo(req, 'RoleController.addParentToRole'),
      })

      const { roleId, parentRoleId } = addParentToRoleSchema.parse(req.params)
      const result = await this.roleService.addParentToRole(roleId, parentRoleId)
    
      new SuccessResponse({
        message: 'Parent added to role successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  deleteParentFromRole = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Deleting parent from role', {
        ...getRequestInfo(req, 'RoleController.deleteParentFromRole'),
      })

      const { roleId, parentRoleId } = deleteParentFromRoleSchema.parse(req.params)
      const result = await this.roleService.deleteParentFromRole(roleId, parentRoleId)
    
      new SuccessResponse({
        message: 'Parent deleted from role successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }
}

export default new RoleController(new RoleService())