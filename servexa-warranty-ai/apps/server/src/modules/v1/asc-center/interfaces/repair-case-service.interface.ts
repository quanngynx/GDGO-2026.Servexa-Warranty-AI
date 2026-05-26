import type { BasePagination } from "@/types/pagination";
import type {
  RepairCaseStatusHistory,
  RepairCaseFieldHistory,
  AccessoryRequest,
  RepairCase,
  Prisma,
} from "@servexa-warranty-ai/db/prisma/client";
import type {
  FindAllRepairCasesInput,
  FindWaitingAccessoriesInput,
  CreateRepairCaseInput,
  ReplaceRepairCaseInput,
  UpdateRepairCaseInput,
  GrantAccessoriesInput,
  ExportRepairCasesInput,
  RepairCaseListItem,
  RepairCaseDetail,
  GrantedAccessoryDto,
  RepairCaseImageDto,
} from "../dtos/repair-case.dto";
import { Workbook } from "exceljs";

export interface IRepairCaseService {
  findAll(
    input: FindAllRepairCasesInput,
  ): Promise<{ items: RepairCaseListItem[], pagination: BasePagination }>;
  findWaitingAccessories(
    input: FindWaitingAccessoriesInput,
  ): Promise<{ items: RepairCaseListItem[], pagination: BasePagination }>;
  findOneById(id: string): Promise<(RepairCase & Prisma.RepairCaseInclude) | null>;

  findStatusHistory(id: string): Promise<RepairCaseStatusHistory[]>;
  findFieldHistory(id: string): Promise<RepairCaseFieldHistory[]>;
  findAccessoryRequests(id: string): Promise<(AccessoryRequest & Prisma.AccessoryRequestInclude)[] | null>;
  findImages(id: string): Promise<RepairCaseImageDto[]>;
  findImageById(id: string, imageId: string): Promise<RepairCaseImageDto>;

  exportFixing(filter: ExportRepairCasesInput): Promise<Workbook>;
  exportWaitingParts(filter: ExportRepairCasesInput): Promise<Workbook>;
  exportExchangeInProgress(filter: ExportRepairCasesInput): Promise<Workbook>;
  exportRepeatedHuyphieu(filter: ExportRepairCasesInput): Promise<Workbook>;

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
    id: string,
    input: GrantAccessoriesInput,
    userId: string,
  ): Promise<GrantedAccessoryDto[]>;
  revokeAccessory(
    id: string,
    accessoryRowId: string,
    userId: string,
  ): Promise<void>;
  addImages(
    id: string,
    files: Express.Multer.File[],
    imageType: string,
    description: string | undefined,
    userId: string,
  ): Promise<RepairCaseImageDto[]>;
  deleteImage(id: string, imageId: string): Promise<void>;
}
