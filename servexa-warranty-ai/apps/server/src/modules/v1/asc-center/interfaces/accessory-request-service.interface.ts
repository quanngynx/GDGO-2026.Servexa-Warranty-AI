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

export interface IAccessoryRequestService {
  findAll(query: FindAllAccessoryRequestsInput): Promise<unknown>;
  findOneById(id: string): Promise<unknown>;

  create(input: CreateAccessoryRequestInput, userId: string): Promise<unknown>;
  update(id: string, input: UpdateAccessoryRequestInput): Promise<unknown>;
  delete(id: string): Promise<{ success: boolean }>;

  addItem(id: string, input: CreateAccessoryRequestItemInput): Promise<unknown>;
  updateItem(
    id: string,
    itemId: string,
    input: UpdateAccessoryRequestItemInput,
  ): Promise<unknown>;
  removeItem(id: string, itemId: string): Promise<{ success: boolean }>;

  submit(id: string): Promise<unknown>;
  approve(
    id: string,
    input: ApproveAccessoryRequestInput,
    userId: string,
  ): Promise<unknown>;
  reject(
    id: string,
    input: RejectAccessoryRequestInput,
    userId: string,
  ): Promise<unknown>;
  recall(id: string, input: RecallAccessoryRequestInput): Promise<unknown>;
}
