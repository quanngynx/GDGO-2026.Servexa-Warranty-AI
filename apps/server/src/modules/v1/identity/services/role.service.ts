import prisma from '@/core/infra/prisma';

import { RoleRepository } from '../repositories/role.repository';
import { RoleClosureRepository } from '../repositories/role-closure.repository';
import { UserRoleRepository } from '../repositories/user-role.repository';
import { RolePermissionRepository } from '../repositories/role-permission.repository';
import { PermissionCacheService } from './permission-cache.service';

import { ExtractPagination } from '@/utils/extract-pagination';

import type { FindAllRolesDto, RoleCreationDto } from '../dtos/role.dto';
import type { Prisma, Role } from '@/core/infra/prisma/generated/client';
import { createOperationalError } from '@/middlewares/error-middleware';
import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant';

export interface RoleTreeNode extends Role {
  children: RoleTreeNode[];
}

export class RoleService {
  private extractPagination: ExtractPagination
  private roleRepository: RoleRepository
  private roleClosureRepository: RoleClosureRepository
  private rolePermissionRepository: RolePermissionRepository
  private userRoleRepository: UserRoleRepository
  private permissionCacheService: PermissionCacheService

  constructor() {
    this.extractPagination = new ExtractPagination()
    this.roleRepository = new RoleRepository()
    this.roleClosureRepository = new RoleClosureRepository()
    this.rolePermissionRepository = new RolePermissionRepository()
    this.userRoleRepository = new UserRoleRepository()
    this.permissionCacheService = new PermissionCacheService()
  }

  async findAllRoles(query: FindAllRolesDto) {
    const { page, limit, search, sortBy, sortOrder } = query;

    const searchQuery = this.extractPagination.buildSearchQuery(search);
    const orderByQuery =
      this.extractPagination.buildSortOrder<Prisma.RoleOrderByWithRelationInput>(
        sortBy,
        sortOrder,
      );

    const whereQuery: Prisma.RoleWhereInput = {
      ...searchQuery,
    };

    const roles = await this.roleRepository.findMany({
      where: whereQuery,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: orderByQuery,
    });
    return roles;
  }

  async getRoleTree() {
    const roles = await prisma.role.findMany({
      include: {
        descendantClosures: true,
        ancestorClosures: true,
      },
    });

    const map = new Map<string, RoleTreeNode>();
    roles.forEach((r) => {
      map.set(r.id, {
        id: r.id,
        name: r.name,
        description: r.description,
        createdAt: r.createdAt,
        children: [],
      });
    });

    // Assign relationship parent→child (depth=1)
    for (const role of roles) {
      for (const link of role.descendantClosures) {
        if (link.depth === 1) {
          const parent = map.get(role.id);
          const child = map.get(link.descendantId);
          if (parent && child) {
            parent.children.push(child);
          }
        }
      }
    }

    // Find root (role without parent depth=1)
    const roots = roles
      .filter((r) => r.ancestorClosures.some((c) => c.depth === 1)) // role without parent depth=1
      .map((r) => map.get(r.id));

    return roots;
  }

  async findOneById(roleId: string) {
    const role = await this.roleRepository.findOneById(roleId);
    if (!role) throw createOperationalError('Role not found', HTTP_RESPONSE_CODE.BAD_REQUEST);

    const [parents, children, ancestors, descendants] = await Promise.all([
      // // DIRECT parents (depth=1)
      this.roleClosureRepository.findManyAncestorByDescendantId({
        descendantId: role.id,
        depth: 1,
      }),
      // DIRECT children (depth=1)
      this.roleClosureRepository.findManyDescendantByAncestorId({
        ancestorId: role.id,
        depth: 1,
      }),
      // ALL ancestors (depth >= 1)
      this.roleClosureRepository.findManyAncestorByDescendantId({
        descendantId: role.id,
        depth: { gte: 1 },
      }),
      // ALL descendants (depth >= 1)
      this.roleClosureRepository.findManyDescendantByAncestorId({
        ancestorId: role.id,
        depth: { gte: 1 },
      }),
    ]);
    // Permissions inherited: → ancestor roles provide permission to descendant
    const inheritedPermissions =
      await this.rolePermissionRepository.findManyByRoleIds({
        roleIds: ancestors.map((a) => a.ancestorId).concat([role.id]),
        options: { include: { permission: true } },
      });

    return {
      ...role,
      parents: parents,
      children: children,
      ancestors: ancestors,
      descendants: descendants,
      permissions: inheritedPermissions,
    };
  }

  async findParentsByRoleId(roleId: string) {
    const parents =
      await this.roleClosureRepository.findManyAncestorByDescendantId({
        descendantId: roleId,
        depth: { gt: 0 },
      });
    return parents;
  }

  async findChildrenByRoleId(roleId: string) {
    const children =
      await this.roleClosureRepository.findManyDescendantByAncestorId({
        ancestorId: roleId,
        depth: { gt: 0 },
      });
    return children;
  }

  async createRole(data: RoleCreationDto) {
    const transactionToCreateEmptyRole = await prisma.$transaction(
      async (tx) => {
        const role = await this.roleRepository.createOneWithTransaction(tx, {
          name: data.name,
          description: data.description,
        });

        await this.roleClosureRepository.createOneWithTransaction(tx, {
          ancestor: { connect: { id: role.id } },
          descendant: { connect: { id: role.id } },
          depth: 0,
        });
        return role;
      },
    );

    if (data.parentRoleId) {
      const transactionToAddParentToRole = await this.addParentToRole(
        transactionToCreateEmptyRole.id,
        data.parentRoleId,
      );
      return {
        role: transactionToCreateEmptyRole,
        addParent: transactionToAddParentToRole,
      };
    }

    return {
      role: transactionToCreateEmptyRole,
    };
  }

  async addParentToRole(childRoleId: string, parentRoleId: string) {
    const transaction = prisma.$transaction(async (tx) => {
      // Check if childRoleId is the same as parentRoleId
      if (childRoleId === parentRoleId) {
        throw createOperationalError('A role cannot be parent of itself', HTTP_RESPONSE_CODE.BAD_REQUEST);
      }
      // Check if childRoleId is already a descendant of parentRoleId
      const isDescendant =
        await this.roleClosureRepository.findUniqueByAncestorIdDescendantIdWithTransaction(
          tx,
          parentRoleId,
          childRoleId,
        );
      if (isDescendant) {
        throw createOperationalError('Cycle detected: Child role is already a descendant of parent role', HTTP_RESPONSE_CODE.BAD_REQUEST);
      }
      // get all ancestor of parent (a)
      const parentAncestors =
        await this.roleClosureRepository.findManyAncestorByDescendantId({
          descendantId: parentRoleId,
          options: {
            select: {
              ancestorId: true,
              depth: true,
            },
          },
        });
      // get all descendant of child (d)
      const childDescendants =
        await this.roleClosureRepository.findManyDescendantByAncestorId({
          ancestorId: childRoleId,
          options: {
            select: {
              descendantId: true,
              depth: true,
            },
          },
        });
      // Merge all (a, d) then insert row into depth = dept(a -> parent) + 1 + dept(child -> d)
      const closureRelationsToInsert: Prisma.RoleClosureCreateManyInput[] = [];
      for (const parentAncestor of parentAncestors) {
        for (const childDescendant of childDescendants) {
          const depth = parentAncestor.depth + 1 + childDescendant.depth;
          closureRelationsToInsert.push({
            ancestorId: parentAncestor.ancestorId,
            descendantId: childDescendant.descendantId,
            depth,
          });
        }
      }

      // Insert all closure relations
      // Void duplicate check -> throw error if duplicate
      // Check existence of all closure relations -> throw null if not exist
      for (const closureRelation of closureRelationsToInsert) {
        const existingClosureRelation = await this.roleClosureRepository
          .findUniqueByAncestorIdDescendantIdWithTransaction(
            tx,
            closureRelation.ancestorId,
            closureRelation.descendantId,
          )
          .catch(() => null);

        if (!existingClosureRelation) {
          await this.roleClosureRepository.createOneWithTransaction(tx, {
            ancestor: { connect: { id: closureRelation.ancestorId } },
            descendant: { connect: { id: closureRelation.descendantId } },
            depth: closureRelation.depth,
          });
        }
      }

      // Return true if all closure relations are inserted successfully
      return true;
    });

    // Hierarchy changed: cannot determine which users are affected, nuke all caches
    await this.permissionCacheService.deleteAll()

    return transaction;
  }

  async assignRoleToUser(userId: string, roleId: string) {
    const exists = await this.userRoleRepository.findOneByUserIdRoleId(
      userId,
      roleId,
    );
    if (exists) {
      throw createOperationalError('Role already assigned to user', HTTP_RESPONSE_CODE.BAD_REQUEST);
    }

    const createUserRole = await this.userRoleRepository.createOne({
      user: { connect: { id: userId } },
      role: { connect: { id: roleId } },
    });

    // Invalidate only this user's permission cache — role set changed
    await this.permissionCacheService.delete(userId)

    return createUserRole;
  }

  async deleteParentFromRole(childRoleId: string, parentRoleId: string) {
    const transaction = prisma.$transaction(async (tx) => {
      const checkExistenceOfRoleClosure =
        await this.roleClosureRepository.findUniqueByAncestorIdDescendantIdWithTransaction(
          tx,
          parentRoleId,
          childRoleId,
        );

      if (
        !checkExistenceOfRoleClosure ||
        checkExistenceOfRoleClosure.depth !== 1
      ) {
        throw createOperationalError('Parent is not a direct parent of child', HTTP_RESPONSE_CODE.BAD_REQUEST);
      }

      // get all ancestor of parent
      const parentAncestors =
        await this.roleClosureRepository.findManyAncestorByDescendantId({
          descendantId: parentRoleId,
          options: {
            select: {
              ancestorId: true,
              // depth: true,
            },
          },
        });
      // get all descendant of child
      const childDescendants =
        await this.roleClosureRepository.findManyDescendantByAncestorId({
          ancestorId: childRoleId,
          options: {
            select: {
              descendantId: true,
              // depth: true,
            },
          },
        });

      // delete all path ancestor(parent) → descendant(child)
      await this.roleClosureRepository.deleteManyByAncestorIdDescendantIdWithTransaction(
        {
          tx,
          ancestorId: { in: parentAncestors.map((p) => p.ancestorId) },
          descendantId: { in: childDescendants.map((c) => c.descendantId) },
          // validate depth > 0 to void self-reference
          depth: { gt: 0 },
        },
      );
      return true;
    });

    // Hierarchy changed: cannot determine which users are affected, nuke all caches
    await this.permissionCacheService.deleteAll()

    return transaction;
  }
}
