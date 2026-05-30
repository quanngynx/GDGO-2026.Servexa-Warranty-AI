import type { BasePagination } from '@/types/pagination';
import type {
  FindAllAccessoryRequestsInput,
  CreateAccessoryRequestInput,
  UpdateAccessoryRequestInput,
  CreateAccessoryRequestItemInput,
  UpdateAccessoryRequestItemInput,
  ApproveAccessoryRequestInput,
  RejectAccessoryRequestInput,
  RecallAccessoryRequestInput,
} from '../dtos/accessory-request.dto';
import type {
  AccessoryRequestDetail,
  AccessoryRequestHeader,
  AccessoryRequestListItem,
} from '../accessory-request.types';

export interface IAccessoryRequestService {
  findAll(
    query: FindAllAccessoryRequestsInput,
  ): Promise<{ items: AccessoryRequestListItem[] | null; pagination: BasePagination }>;
  findOneById(id: string): Promise<AccessoryRequestDetail>;

  create(
    input: CreateAccessoryRequestInput,
    userId: string,
  ): Promise<AccessoryRequestDetail | null>;
  update(id: string, input: UpdateAccessoryRequestInput): Promise<AccessoryRequestHeader>;
  delete(id: string): Promise<{ success: boolean }>;

  addItem(id: string, input: CreateAccessoryRequestItemInput): Promise<unknown>;
  updateItem(
    id: string,
    itemId: string,
    input: UpdateAccessoryRequestItemInput,
  ): Promise<unknown>;
  removeItem(id: string, itemId: string): Promise<{ success: boolean }>;

  submit(id: string): Promise<AccessoryRequestHeader>;
  approve(
    id: string,
    input: ApproveAccessoryRequestInput,
    userId: string,
  ): Promise<AccessoryRequestHeader>;
  reject(
    id: string,
    input: RejectAccessoryRequestInput,
    userId: string,
  ): Promise<AccessoryRequestHeader>;
  recall(id: string, input: RecallAccessoryRequestInput): Promise<AccessoryRequestHeader>;
}
