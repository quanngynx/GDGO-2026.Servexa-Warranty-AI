import prisma from '@servexa-warranty-ai/db'

import type { Prisma } from '@servexa-warranty-ai/db/prisma/client';

type UserRoleQuery = Prisma.UserRoleSelect | undefined;
type UserRoleInclude = Prisma.UserRoleInclude | undefined;
type UserRoleResult = Prisma.UserRoleGetPayload<{
  select: UserRoleQuery;
  include: UserRoleInclude;
}>;

export class UserRoleRepository {
  async findOneByUserIdRoleId(
    userId: string,
    roleId: string,
    options?: { select?: UserRoleQuery; include?: UserRoleInclude },
  ): Promise<UserRoleResult | null> {
    const buildQuery = await prisma.userRole.findUnique({
      where: { userId_roleId: { userId, roleId } },
      ...options,
    });
    return buildQuery;
  }

  async findManyByUserId(
    userId: string,
    options?: { select?: UserRoleQuery; include?: UserRoleInclude },
  ): Promise<UserRoleResult[]> {
    const buildQuery = await prisma.userRole.findMany({
      where: { userId },
      ...options,
    });
    return buildQuery;
  }

  async createOne(
    data: Prisma.UserRoleCreateInput,
    options?: { select?: UserRoleQuery; include?: UserRoleInclude },
  ): Promise<UserRoleResult> {
    const buildQuery = await prisma.userRole.create({
      data,
      ...options,
    });
    return buildQuery;
  }
}
