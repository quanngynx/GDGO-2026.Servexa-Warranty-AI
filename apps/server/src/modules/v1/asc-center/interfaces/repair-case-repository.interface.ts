import {
  type RepairCaseStatusHistory,
  type RepairCaseFieldHistory,
  type AccessoryRequest,
  type RepairCaseAccessory,
  Prisma,
} from "@/core/infra/prisma/generated/client";
import type {
  FindAllRepairCasesInput,
  CreateRepairCaseInput,
  ReplaceRepairCaseInput,
  UpdateRepairCaseInput,
  ExportRepairCasesInput,
  RepairCaseListItem,
  RepairCaseDetail,
  GrantedAccessoryDto,
  RepairCaseImageDto,
} from "../dtos/repair-case.dto";

export interface IRepairCaseRepository {
  findMany(input: FindAllRepairCasesInput): Promise<RepairCaseListItem[]>;
  count(input: FindAllRepairCasesInput): Promise<number>;
  findOneById(id: string): Promise<RepairCaseDetail | null>;
  findStatusHistory(id: string): Promise<RepairCaseStatusHistory[]>;
  findFieldHistory(id: string): Promise<RepairCaseFieldHistory[]>;
  findAccessoryRequests(id: string): Promise<AccessoryRequest[] | null>;
  findImages(id: string): Promise<RepairCaseImageDto[]>;
  findImageById(
    id: string,
    imageId: string,
  ): Promise<RepairCaseImageDto | null>;
  findAccessoryRowById(
    id: string,
    accessoryRowId: string,
  ): Promise<RepairCaseAccessory | null>;
  findManyForExport(
    kind:
      | "fixing"
      | "waiting_parts"
      | "exchange_in_progress"
      | "repeated_huyphieu",
    filter: ExportRepairCasesInput,
  ): Promise<any[]>;
  findRepeatedHuyphieuSerials(): Promise<string[]>;

  generateCaseNumber(
    ascCenterId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<string>;
  create(
    input: CreateRepairCaseInput,
    userId: string,
  ): Promise<RepairCaseDetail>;
  replace(
    id: string,
    input: ReplaceRepairCaseInput,
    userId: string,
  ): Promise<RepairCaseDetail>;
  update(
    id: string,
    input: UpdateRepairCaseInput,
    userId: string,
  ): Promise<RepairCaseDetail>;

  grantAccessories(
    repairCaseId: string,
    ascCenterId: string,
    items: any[],
    userId: string,
  ): Promise<GrantedAccessoryDto[]>;
  revokeAccessory(
    repairCaseId: string,
    accessoryRowId: string,
    userId: string,
  ): Promise<void>;
  addImages(
    repairCaseId: string,
    files: Express.Multer.File[],
    imageType: string,
    description: string | undefined,
    userId: string,
  ): Promise<RepairCaseImageDto[]>;
  deleteImage(repairCaseId: string, imageId: string): Promise<RepairCaseImageDto>;
}
