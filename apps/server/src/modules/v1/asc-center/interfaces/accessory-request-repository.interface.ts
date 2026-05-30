import {
  type AccessoryRequest,
  type AccessoryRequestItem,
  type Prisma,
} from "@servexa-warranty-ai/db/prisma/client";
import { type FindAllAccessoryRequestsInput } from "../dtos/accessory-request.dto";

export interface IAccessoryRequestRepository {
  findMany(
    query: FindAllAccessoryRequestsInput,
    skip: number,
  ): Promise<(AccessoryRequest & Prisma.AccessoryRequestInclude)[] | null>;
  count(query: FindAllAccessoryRequestsInput): Promise<number>;
  findById(
    id: string,
  ): Promise<(AccessoryRequest & Prisma.AccessoryRequestInclude) | null>;
  findByIdHeaderOnly(id: string): Promise<(AccessoryRequest & Prisma.AccessoryRequestInclude) | null>;
  findItemById(
    id: string,
    itemId: string,
  ): Promise<(AccessoryRequestItem & Prisma.AccessoryRequestItemInclude) | null>;

  createWithItems(
    data: Prisma.AccessoryRequestUncheckedCreateInput,
    items: Prisma.AccessoryRequestItemCreateWithoutRequestInput[],
    tx?: Prisma.TransactionClient,
  ): Promise<(AccessoryRequest & Prisma.AccessoryRequestInclude) | null>;

  updateHeader(
    id: string,
    data: Prisma.AccessoryRequestUncheckedUpdateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<(AccessoryRequest & Prisma.AccessoryRequestInclude) | null>;
  deleteWithItems(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<(AccessoryRequest & Prisma.AccessoryRequestInclude) | null>;

  addItem(
    data: Prisma.AccessoryRequestItemUncheckedCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<AccessoryRequestItem>;
  updateItem(
    itemId: string,
    data: Prisma.AccessoryRequestItemUncheckedUpdateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<AccessoryRequestItem>;
  removeItem(
    itemId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<AccessoryRequestItem>;

  updateItemsApproval(
    updates: {
      itemId: string;
      data: Prisma.AccessoryRequestItemUncheckedUpdateInput;
    }[],
    tx?: Prisma.TransactionClient,
  ): Promise<void>;

  countTodayByAscCenter(
    ascCenterId: string,
    startDate: Date,
    endDate: Date,
    tx?: Prisma.TransactionClient,
  ): Promise<number>;
}
