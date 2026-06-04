import prisma from "@/core/infra/prisma";
import { Prisma } from "@/core/infra/prisma/generated/client";

type RoleClosureQuery = Prisma.RoleClosureSelect | null;
type RoleClosureInclude = Prisma.RoleClosureInclude | null;
type RoleClosureResult = Prisma.RoleClosureGetPayload<{
  select: RoleClosureQuery;
  include: RoleClosureInclude;
}>;

export class RoleClosureRepository {
  async findManyByAncestorIds(
    ancestorIds: string[],
    options?: {
      select?: RoleClosureQuery;
      include?: RoleClosureInclude;
    },
  ): Promise<RoleClosureResult[]> {
    const buildQuery = await prisma.roleClosure.findMany({
      where: { ancestorId: { in: ancestorIds } },
      ...options,
    });
    return buildQuery;
  }

  async findManyByDescendantIds(
    descendantIds: string[],
    options?: {
      select?: RoleClosureQuery;
      include?: RoleClosureInclude;
    },
  ): Promise<RoleClosureResult[]> {
    const buildQuery = await prisma.roleClosure.findMany({
      where: { descendantId: { in: descendantIds } },
      ...options,
    });
    return buildQuery;
  }

  async findManyAncestorByDescendantId({
    descendantId,
    options,
    depth,
  }: {
    descendantId: string;
    options?: {
      select?: RoleClosureQuery;
      include?: RoleClosureInclude;
    };
    depth?: number | { gt: number } | { gte: number };
  }): Promise<RoleClosureResult[]> {
    const buildQuery = await prisma.roleClosure.findMany({
      where: { descendantId, depth },
      ...options,
    });
    return buildQuery;
  }

  async findManyDescendantByAncestorId({
    ancestorId,
    options,
    depth,
  }: {
    ancestorId: string;
    options?: {
      select?: RoleClosureQuery;
      include?: RoleClosureInclude;
    };
    depth?: number | { gt: number } | { gte: number };
  }): Promise<RoleClosureResult[]> {
    const buildQuery = await prisma.roleClosure.findMany({
      where: { ancestorId, depth },
      ...options,
    });
    return buildQuery;
  }

  async findUniqueByAncestorIdDescendantIdWithTransaction(
    tx: Prisma.TransactionClient,
    ancestorId: string,
    descendantId: string,
    options?: {
      select?: RoleClosureQuery;
      include?: RoleClosureInclude;
    },
  ): Promise<RoleClosureResult | null> {
    const buildQuery = await tx.roleClosure.findUnique({
      where: {
        ancestorId_descendantId: {
          ancestorId,
          descendantId,
        },
      },
      ...options,
    });
    return buildQuery;
  }

  async createOne<
    T extends RoleClosureQuery = null,
    I extends RoleClosureInclude = null,
  >(
    data: Prisma.RoleClosureCreateInput,
    options?: {
      select?: T;
      include?: I;
    },
  ): Promise<RoleClosureResult> {
    const buildQuery = await prisma.roleClosure.create({
      data,
      ...options,
    });
    return buildQuery;
  }

  async createOneWithTransaction<
    T extends RoleClosureQuery = null,
    I extends RoleClosureInclude = null,
  >(
    tx: Prisma.TransactionClient,
    data: Prisma.RoleClosureCreateInput,
    options?: {
      select?: T;
      include?: I;
    },
  ): Promise<RoleClosureResult> {
    const buildQuery = await tx.roleClosure.create({
      data,
      ...options,
    });
    return buildQuery;
  }

  async deleteManyByAncestorIdDescendantIdWithTransaction({
    tx,
    ancestorId,
    descendantId,
    depth,
  }: {
    tx: Prisma.TransactionClient;
    ancestorId: string | { in: string[] };
    descendantId: string | { in: string[] };
    depth?: number | { gt: number };
  }) {
    const buildQuery = await tx.roleClosure.deleteMany({
      where: {
        ancestorId,
        descendantId,
        depth,
      },
    });
    return buildQuery;
  }
}
