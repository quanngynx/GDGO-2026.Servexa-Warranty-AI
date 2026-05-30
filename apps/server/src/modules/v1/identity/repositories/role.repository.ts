import prisma from '@servexa-warranty-ai/db';
import type { Prisma } from '@servexa-warranty-ai/db/prisma/client';

type RoleQuery = Prisma.RoleSelect | null;
type RoleInclude = Prisma.RoleInclude | null;
type RoleResult = Prisma.RoleGetPayload<{
  select: RoleQuery;
  include: RoleInclude;
}>;

export class RoleRepository {
  async findMany(query: Prisma.RoleFindManyArgs) {
    const { take: limit, skip: offset, where, orderBy, ...rest } = query;
    const buildQuery = await prisma.role.findMany({
      take: limit,
      skip: offset,
      where,
      orderBy,
      ...rest,
    });
    return buildQuery;
  }

  async thenCount(query: Prisma.RoleCountArgs) {
    const { where, ...rest } = query;
    const buildQuery = await prisma.role.count({
      where,
      ...rest,
    });
    return buildQuery;
  }

  async findOneById(
    roleId: string,
    options?: { select?: RoleQuery; include?: RoleInclude },
  ) {
    const buildQuery = await prisma.role.findUnique({
      where: { id: roleId },
      ...options,
    });
    return buildQuery;
  }

  async createOneWithTransaction<
    T extends RoleQuery = null,
    I extends RoleInclude = null,
  >(
    tx: Prisma.TransactionClient,
    data: Prisma.RoleCreateInput,
    options?: {
      select?: T;
      include?: I;
    },
  ): Promise<RoleResult> {
    const buildQuery = await tx.role.create({
      data,
      ...options,
    });
    return buildQuery;
  }
}
