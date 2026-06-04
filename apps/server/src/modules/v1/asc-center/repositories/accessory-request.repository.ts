import prisma from "@/core/infra/prisma";
import { Prisma } from "@/core/infra/prisma/generated/client";
import type { IAccessoryRequestRepository } from "../interfaces/accessory-request-repository.interface";
import type { FindAllAccessoryRequestsInput } from "../dtos/accessory-request.dto";
import {
  accessoryRequestDetailInclude,
  accessoryRequestSelect,
} from "../accessory-request.types";

export class AccessoryRequestRepository implements IAccessoryRequestRepository {
  private _buildWhere(
    query: FindAllAccessoryRequestsInput,
  ): Prisma.AccessoryRequestWhereInput {
    const where: Prisma.AccessoryRequestWhereInput = {};
    if (query.status) where.status = query.status;
    if (query.statusRecall) where.statusRecall = query.statusRecall;
    if (query.urgency) where.urgency = query.urgency;
    if (query.ascCenterId) where.ascCenterId = query.ascCenterId;
    if (query.repairCaseId) where.repairCaseId = query.repairCaseId;
    if (query.requestedBy) where.requestedBy = query.requestedBy;
    if (query.approvedBy) where.approvedBy = query.approvedBy;
    if (query.requestDateFrom || query.requestDateTo) {
      where.requestDate = {};
      if (query.requestDateFrom) where.requestDate.gte = query.requestDateFrom;
      if (query.requestDateTo) where.requestDate.lte = query.requestDateTo;
    }
    if (query.search) {
      where.OR = [
        { requestNumber: { contains: query.search, mode: "insensitive" } },
        { justification: { contains: query.search, mode: "insensitive" } },
      ];
    }
    return where;
  }

  async findMany(query: FindAllAccessoryRequestsInput, skip: number) {
    const where = this._buildWhere(query);
    return prisma.accessoryRequest.findMany({
      where,
      skip,
      take: query.limit,
      orderBy: { [query.sortBy]: query.sortOrder },
      select: accessoryRequestSelect,
    });
  }

  async count(query: FindAllAccessoryRequestsInput) {
    return prisma.accessoryRequest.count({ where: this._buildWhere(query) });
  }

  async findById(id: string) {
    return prisma.accessoryRequest.findUnique({
      where: { id },
      include: accessoryRequestDetailInclude,
    });
  }

  async findByIdHeaderOnly(id: string) {
    return prisma.accessoryRequest.findUnique({ where: { id } });
  }

  async findItemById(id: string, itemId: string) {
    return prisma.accessoryRequestItem.findFirst({
      where: { id: itemId, requestId: id },
    });
  }

  async createWithItems(
    data: Prisma.AccessoryRequestUncheckedCreateInput,
    items: Prisma.AccessoryRequestItemCreateWithoutRequestInput[],
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || prisma;
    return client.accessoryRequest.create({
      data: {
        ...data,
        items: {
          create: items,
        },
      },
      include: accessoryRequestDetailInclude,
    });
  }

  async updateHeader(
    id: string,
    data: Prisma.AccessoryRequestUncheckedUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || prisma;
    return client.accessoryRequest.update({ where: { id }, data });
  }

  async deleteWithItems(id: string, tx?: Prisma.TransactionClient) {
    const client = tx || prisma;
    await client.accessoryRequestItem.deleteMany({ where: { requestId: id } });
    return client.accessoryRequest.delete({ where: { id } });
  }

  async addItem(
    data: Prisma.AccessoryRequestItemUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || prisma;
    return client.accessoryRequestItem.create({ data });
  }

  async updateItem(
    itemId: string,
    data: Prisma.AccessoryRequestItemUncheckedUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || prisma;
    return client.accessoryRequestItem.update({ where: { id: itemId }, data });
  }

  async removeItem(itemId: string, tx?: Prisma.TransactionClient) {
    const client = tx || prisma;
    return client.accessoryRequestItem.delete({ where: { id: itemId } });
  }

  async updateItemsApproval(
    updates: {
      itemId: string;
      data: Prisma.AccessoryRequestItemUncheckedUpdateInput;
    }[],
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || prisma;
    await Promise.all(
      updates.map((update) =>
        client.accessoryRequestItem.update({
          where: { id: update.itemId },
          data: update.data,
        }),
      ),
    );
  }

  async countTodayByAscCenter(
    ascCenterId: string,
    startDate: Date,
    endDate: Date,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx || prisma;
    return client.accessoryRequest.count({
      where: {
        ascCenterId,
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
    });
  }
}
