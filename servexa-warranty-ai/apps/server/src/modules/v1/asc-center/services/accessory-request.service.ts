import prisma from "@servexa-warranty-ai/db";
import {
  Prisma,
  AccessoryRequestStatus,
  AccessoryRequestItemStatus,
} from "@servexa-warranty-ai/db/prisma/client";
import type {
  AccessoryRequest,
  AccessoryRequestItem,
  AccessoryRequestStatus as AccessoryRequestStatusType,
} from "@servexa-warranty-ai/db/prisma/client";
import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import { createOperationalError } from "@/middlewares/error-middleware";
import { buildPagination } from "@/utils/pagination";

import type { IAccessoryRequestService } from "../interfaces/accessory-request-service.interface";
import type { IAccessoryRequestRepository } from "../interfaces/accessory-request-repository.interface";
import { AccessoryRequestRepository } from "../repositories/accessory-request.repository";
import type {
  FindAllAccessoryRequestsInput,
  CreateAccessoryRequestInput,
  UpdateAccessoryRequestInput,
  CreateAccessoryRequestItemInput,
  UpdateAccessoryRequestItemInput,
  ApproveAccessoryRequestInput,
  RejectAccessoryRequestInput,
  RecallAccessoryRequestInput,
} from "../dtos/accessory-request.dto";

export class AccessoryRequestService implements IAccessoryRequestService {
  constructor(
    private readonly repository: IAccessoryRequestRepository = new AccessoryRequestRepository(),
  ) {}

  async findAll(query: FindAllAccessoryRequestsInput) {
    const skip = (query.page - 1) * query.limit;
    const [items, total] = await Promise.all([
      this.repository.findMany(query, skip),
      this.repository.count(query),
    ]);

    return {
      items,
      pagination: buildPagination(query.page, query.limit, total),
    };
  }

  async findOneById(id: string) {
    const found = await this.repository.findById(id);
    if (!found) {
      throw createOperationalError(
        "Accessory request not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    }
    return found;
  }

  async create(input: CreateAccessoryRequestInput, userId: string) {
    const ascCenter = await prisma.ascCenter.findUnique({
      where: { id: input.ascCenterId },
    });
    if (!ascCenter)
      throw createOperationalError(
        "ASC Center not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );

    const accessoryIds = input.items.map((i) => i.accessoryId);
    const accessories = await prisma.accessory.findMany({
      where: { id: { in: accessoryIds } },
    });
    if (accessories.length !== new Set(accessoryIds).size) {
      throw createOperationalError(
        "One or more accessories not found or invalid",
        HTTP_RESPONSE_CODE.BAD_REQUEST,
      );
    }

    const allHavePrice = input.items.every(
      (i) => i.unitPrice !== undefined && i.unitPrice !== null,
    );
    let totalEstimatedCost: Prisma.Decimal | null = null;
    if (allHavePrice) {
      const sum = input.items.reduce(
        (acc, curr) =>
          acc + curr.requestedQuantity * curr.unitPrice,
        0,
      );
      totalEstimatedCost = new Prisma.Decimal(sum);
    }

    let created:
      | (AccessoryRequest & { items: AccessoryRequestItem[] })
      | null = null;
    let attempts = 0;
    while (attempts < 2) {
      try {
        created = await prisma.$transaction(async (tx) => {
          const now = new Date();
          const startOfDay = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
          );
          const endOfDay = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            23,
            59,
            59,
            999,
          );

          const count = await this.repository.countTodayByAscCenter(
            input.ascCenterId,
            startOfDay,
            endOfDay,
            tx,
          );
          const countStr = String(count + 1).padStart(4, "0");
          const dateStr = [
            startOfDay.getFullYear(),
            String(startOfDay.getMonth() + 1).padStart(2, "0"),
            String(startOfDay.getDate()).padStart(2, "0"),
          ].join("");
          const requestNumber = `AR-${dateStr}-${countStr}`;

          const createData: Prisma.AccessoryRequestUncheckedCreateInput = {
            requestNumber,
            ascCenterId: input.ascCenterId,
            repairCaseId: input.repairCaseId,
            requestedBy: userId,
            requestDate: input.requestDate,
            urgency: input.urgency,
            justification: input.justification,
            status: AccessoryRequestStatus.draft,
            totalEstimatedCost,
          };

          const itemsData: Prisma.AccessoryRequestItemCreateWithoutRequestInput[] =
            input.items.map<Prisma.AccessoryRequestItemCreateWithoutRequestInput>((i) => ({
              accessory: { connect: { id: i.accessoryId } },
              requestedQuantity: i.requestedQuantity,
              unitPrice: i.unitPrice ? new Prisma.Decimal(i.unitPrice) : null,
              totalPrice: i.unitPrice
                ? new Prisma.Decimal(i.requestedQuantity * i.unitPrice)
                : null,
              notes: i.notes,
              status: AccessoryRequestItemStatus.pending,
            }));

          return await this.repository.createWithItems(
            createData,
            itemsData,
            tx,
          );
        });
        break;
      } catch (err) {
        const maybePrisma = err as { code?: string };
        if (maybePrisma.code === "P2002" && attempts < 1) {
          attempts++;
          continue;
        }
        throw err;
      }
    }

    if (!created) {
      throw createOperationalError(
        "Failed to generate unique request number",
        HTTP_RESPONSE_CODE.CONFLICT,
      );
    }
    return created;
  }

  async update(id: string, input: UpdateAccessoryRequestInput) {
    const existing = await this.repository.findByIdHeaderOnly(id);
    if (!existing)
      throw createOperationalError(
        "Accessory request not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    if (existing.status !== AccessoryRequestStatus.draft) {
      throw createOperationalError(
        "Cannot update request outside of draft status",
        HTTP_RESPONSE_CODE.CONFLICT,
      );
    }

    if (input.repairCaseId && input.repairCaseId !== existing.repairCaseId) {
      const rc = await prisma.repairCase.findUnique({
        where: { id: input.repairCaseId },
      });
      if (!rc)
        throw createOperationalError(
          "Repair case not found",
          HTTP_RESPONSE_CODE.NOT_FOUND,
        );
    }

    const data: Prisma.AccessoryRequestUncheckedUpdateInput = {};
    if (input.repairCaseId !== undefined)
      data.repairCaseId = input.repairCaseId;
    if (input.requestDate !== undefined) data.requestDate = input.requestDate;
    if (input.urgency !== undefined) data.urgency = input.urgency;
    if (input.justification !== undefined)
      data.justification = input.justification;

    if (Object.keys(data).length === 0) {
      throw createOperationalError(
        "No fields to update",
        HTTP_RESPONSE_CODE.BAD_REQUEST,
      );
    }

    return this.repository.updateHeader(id, data);
  }

  async delete(id: string) {
    const existing = await this.repository.findByIdHeaderOnly(id);
    if (!existing)
      throw createOperationalError(
        "Accessory request not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    if (existing.status !== AccessoryRequestStatus.draft) {
      throw createOperationalError(
        "Cannot delete after submission",
        HTTP_RESPONSE_CODE.CONFLICT,
      );
    }

    await prisma.$transaction(async (tx) => {
      await this.repository.deleteWithItems(id, tx);
    });

    return { success: true };
  }

  private async _recalculateTotalEstimatedCost(
    requestId: string,
    tx: Prisma.TransactionClient,
  ) {
    const items = await tx.accessoryRequestItem.findMany({
      where: { requestId },
    });
    const allHavePrice = items.every((i) => i.unitPrice !== null);
    let totalEstimatedCost: Prisma.Decimal | null = null;
    if (allHavePrice && items.length > 0) {
      const sum = items.reduce(
        (acc, curr) => acc + curr.requestedQuantity * Number(curr.unitPrice),
        0,
      );
      totalEstimatedCost = new Prisma.Decimal(sum);
    }
    await this.repository.updateHeader(requestId, { totalEstimatedCost }, tx);
  }

  async addItem(id: string, input: CreateAccessoryRequestItemInput) {
    const existing = await this.repository.findByIdHeaderOnly(id);
    if (!existing)
      throw createOperationalError(
        "Accessory request not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    if (existing.status !== AccessoryRequestStatus.draft) {
      throw createOperationalError(
        "Cannot add item outside of draft status",
        HTTP_RESPONSE_CODE.CONFLICT,
      );
    }

    const acc = await prisma.accessory.findUnique({
      where: { id: input.accessoryId },
    });
    if (!acc)
      throw createOperationalError(
        "Accessory not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );

    return prisma.$transaction(async (tx) => {
      const data: Prisma.AccessoryRequestItemUncheckedCreateInput = {
        requestId: id,
        accessoryId: input.accessoryId,
        requestedQuantity: input.requestedQuantity,
        unitPrice: input.unitPrice ? new Prisma.Decimal(input.unitPrice) : null,
        totalPrice: input.unitPrice
          ? new Prisma.Decimal(input.requestedQuantity * input.unitPrice)
          : null,
        notes: input.notes,
        status: AccessoryRequestItemStatus.pending,
      };
      const item = await this.repository.addItem(data, tx);
      await this._recalculateTotalEstimatedCost(id, tx);
      return item;
    });
  }

  async updateItem(
    id: string,
    itemId: string,
    input: UpdateAccessoryRequestItemInput,
  ) {
    const existing = await this.repository.findByIdHeaderOnly(id);
    if (!existing)
      throw createOperationalError(
        "Accessory request not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    if (existing.status !== AccessoryRequestStatus.draft) {
      throw createOperationalError(
        "Cannot update item outside of draft status",
        HTTP_RESPONSE_CODE.CONFLICT,
      );
    }

    const item = await this.repository.findItemById(id, itemId);
    if (!item)
      throw createOperationalError(
        "Item not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );

    return prisma.$transaction(async (tx) => {
      const data: Prisma.AccessoryRequestItemUncheckedUpdateInput = {};
      if (input.requestedQuantity !== undefined)
        data.requestedQuantity = input.requestedQuantity;
      if (input.unitPrice !== undefined)
        data.unitPrice = new Prisma.Decimal(input.unitPrice);
      if (input.notes !== undefined) data.notes = input.notes;

      const newQty = input.requestedQuantity ?? item.requestedQuantity;
      const newUnitPrice =
        input.unitPrice !== undefined
          ? new Prisma.Decimal(input.unitPrice)
          : item.unitPrice;
      if (newUnitPrice !== null) {
        data.totalPrice = new Prisma.Decimal(newQty * Number(newUnitPrice));
      } else {
        data.totalPrice = null;
      }

      const updatedItem = await this.repository.updateItem(itemId, data, tx);
      await this._recalculateTotalEstimatedCost(id, tx);
      return updatedItem;
    });
  }

  async removeItem(id: string, itemId: string) {
    const existing = await this.repository.findByIdHeaderOnly(id);
    if (!existing)
      throw createOperationalError(
        "Accessory request not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    if (existing.status !== AccessoryRequestStatus.draft) {
      throw createOperationalError(
        "Cannot remove item outside of draft status",
        HTTP_RESPONSE_CODE.CONFLICT,
      );
    }

    const item = await this.repository.findItemById(id, itemId);
    if (!item)
      throw createOperationalError(
        "Item not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );

    await prisma.$transaction(async (tx) => {
      await this.repository.removeItem(itemId, tx);
      await this._recalculateTotalEstimatedCost(id, tx);
    });
    return { success: true };
  }

  async submit(id: string) {
    const existing = await this.repository.findById(id);
    if (!existing)
      throw createOperationalError(
        "Accessory request not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    if (existing.status !== AccessoryRequestStatus.draft) {
      throw createOperationalError(
        "Only draft requests can be submitted",
        HTTP_RESPONSE_CODE.CONFLICT,
      );
    }
    if (existing.items.length === 0) {
      throw createOperationalError(
        "Request must have at least one item",
        HTTP_RESPONSE_CODE.BAD_REQUEST,
      );
    }

    return this.repository.updateHeader(id, {
      status: AccessoryRequestStatus.submitted,
    });
  }

  async approve(
    id: string,
    input: ApproveAccessoryRequestInput,
    userId: string,
  ) {
    const existing = await this.repository.findById(id);
    if (!existing)
      throw createOperationalError(
        "Accessory request not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    if (existing.status !== AccessoryRequestStatus.submitted) {
      throw createOperationalError(
        "Only submitted requests can be approved/rejected",
        HTTP_RESPONSE_CODE.CONFLICT,
      );
    }

    const existingItemIds = new Set(existing.items.map((i) => i.id));
    const inputItemIds = new Set(input.items.map((i) => i.itemId));

    if (
      existingItemIds.size !== inputItemIds.size ||
      [...existingItemIds].some((x) => !inputItemIds.has(x))
    ) {
      throw createOperationalError(
        "Approve payload must include all current items exactly",
        HTTP_RESPONSE_CODE.BAD_REQUEST,
      );
    }

    return prisma.$transaction(async (tx) => {
      let allFullyApproved = true;
      let allCancelled = true;

      const itemUpdates = input.items.map((inputItem) => {
        const existingItem = existing.items.find(
          (i) => i.id === inputItem.itemId,
        )!;

        if (inputItem.approvedQuantity > existingItem.requestedQuantity) {
          throw createOperationalError(
            `Approved quantity for item ${existingItem.id} exceeds requested quantity`,
            HTTP_RESPONSE_CODE.BAD_REQUEST,
          );
        }

        let itemStatus: AccessoryRequestItemStatus =
          AccessoryRequestItemStatus.pending;
        if (inputItem.approvedQuantity === 0) {
          itemStatus = AccessoryRequestItemStatus.cancelled;
          allFullyApproved = false;
        } else if (
          inputItem.approvedQuantity === existingItem.requestedQuantity
        ) {
          itemStatus = AccessoryRequestItemStatus.fully_approved;
          allCancelled = false;
        } else {
          itemStatus = AccessoryRequestItemStatus.partially_approved;
          allFullyApproved = false;
          allCancelled = false;
        }

        return {
          itemId: inputItem.itemId,
          data: {
            approvedQuantity: inputItem.approvedQuantity,
            status: itemStatus,
          },
        };
      });

      await this.repository.updateItemsApproval(itemUpdates, tx);

      let headerStatus: AccessoryRequestStatusType =
        AccessoryRequestStatus.partially_approved;
      if (allFullyApproved) headerStatus = AccessoryRequestStatus.approved;
      else if (allCancelled) headerStatus = AccessoryRequestStatus.rejected;

      const now = new Date();
      const dateOnly = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );

      return this.repository.updateHeader(
        id,
        {
          status: headerStatus,
          approvedBy: userId,
          approvedDate: dateOnly,
        },
        tx,
      );
    });
  }

  async reject(id: string, input: RejectAccessoryRequestInput, userId: string) {
    const existing = await this.repository.findByIdHeaderOnly(id);
    if (!existing)
      throw createOperationalError(
        "Accessory request not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    if (existing.status !== AccessoryRequestStatus.submitted) {
      throw createOperationalError(
        "Only submitted requests can be rejected",
        HTTP_RESPONSE_CODE.CONFLICT,
      );
    }

    const now = new Date();
    const dateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return this.repository.updateHeader(id, {
      status: AccessoryRequestStatus.rejected,
      approvedBy: userId,
      approvedDate: dateOnly,
      rejectionReason: input.rejectionReason,
    });
  }

  async recall(id: string, input: RecallAccessoryRequestInput) {
    const existing = await this.repository.findByIdHeaderOnly(id);
    if (!existing)
      throw createOperationalError(
        "Accessory request not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );

    return this.repository.updateHeader(id, {
      statusRecall: input.statusRecall,
    });
  }
}
