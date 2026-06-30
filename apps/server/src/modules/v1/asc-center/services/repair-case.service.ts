import { buildPagination } from "@/utils/pagination";
import { createOperationalError } from "@/middlewares/error-middleware";
import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import type { IRepairCaseService } from "../interfaces/repair-case-service.interface";
import type { IRepairCaseRepository } from "../interfaces/repair-case-repository.interface";
import { RepairCaseRepository } from "../repositories/repair-case.repository";
import { RepairCaseExcelService } from "./repair-case-excel.service";
import { Prisma } from "@/core/infra/prisma/generated/client";
import type {
  FindAllRepairCasesInput,
  FindWaitingAccessoriesInput,
  CreateRepairCaseInput,
  ReplaceRepairCaseInput,
  UpdateRepairCaseInput,
  GrantAccessoriesInput,
  ExportRepairCasesInput,
} from "../dtos/repair-case.dto";

export class RepairCaseService implements IRepairCaseService {
  constructor(
    private readonly repairCaseRepository: IRepairCaseRepository = new RepairCaseRepository(),
    private readonly excelService: RepairCaseExcelService = new RepairCaseExcelService(),
  ) {}

  async findAll(input: FindAllRepairCasesInput) {
    const [items, total] = await Promise.all([
      this.repairCaseRepository.findMany(input),
      this.repairCaseRepository.count(input),
    ]);
    return {
      items,
      pagination: buildPagination(input.page || 1, input.limit || 10, total),
    };
  }

  async findWaitingAccessories(input: FindWaitingAccessoriesInput) {
    const [items, total] = await Promise.all([
      this.repairCaseRepository.findMany(input),
      this.repairCaseRepository.count(input),
    ]);
    return {
      items,
      pagination: buildPagination(input.page || 1, input.limit || 10, total),
    };
  }

  async findOneById(id: string) {
    const caseRecord = await this.repairCaseRepository.findOneById(id);
    if (!caseRecord)
      throw createOperationalError(
        "Repair Case not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    return caseRecord;
  }

  async findStatusHistory(id: string) {
    return this.repairCaseRepository.findStatusHistory(id);
  }

  async findFieldHistory(id: string) {
    return this.repairCaseRepository.findFieldHistory(id);
  }

  async findAccessoryRequests(id: string) {
    return this.repairCaseRepository.findAccessoryRequests(id);
  }

  async findImages(id: string) {
    const images = await this.repairCaseRepository.findImages(id);
    if (!images)
      throw createOperationalError(
        "Images not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    return images;
  }

  async findImageById(id: string, imageId: string) {
    const img = await this.repairCaseRepository.findImageById(id, imageId);
    if (!img)
      throw createOperationalError(
        "Image not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    return img;
  }

  async exportFixing(filter: ExportRepairCasesInput) {
    const rows = await this.repairCaseRepository.findManyForExport(
      "fixing",
      filter,
    );
    return this.excelService.buildFixingWorkbook(rows);
  }

  async exportWaitingParts(filter: ExportRepairCasesInput) {
    const rows = await this.repairCaseRepository.findManyForExport(
      "waiting_parts",
      filter,
    );
    return this.excelService.buildWaitingPartsWorkbook(rows);
  }

  async exportExchangeInProgress(filter: ExportRepairCasesInput) {
    const rows = await this.repairCaseRepository.findManyForExport(
      "exchange_in_progress",
      filter,
    );
    return this.excelService.buildExchangeInProgressWorkbook(rows);
  }

  async exportRepeatedHuyphieu(filter: ExportRepairCasesInput) {
    const rows = await this.repairCaseRepository.findManyForExport(
      "repeated_huyphieu",
      filter,
    );
    return this.excelService.buildRepeatedHuyphieuWorkbook(rows);
  }

  async create(input: CreateRepairCaseInput, userId: string) {
    try {
      return await this.repairCaseRepository.create(input, userId);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async replace(id: string, input: ReplaceRepairCaseInput, userId: string) {
    try {
      return await this.repairCaseRepository.replace(id, input, userId);
    } catch (error) {
      if ((error as Error).message === "NOT_FOUND") {
        throw createOperationalError(
          "Repair Case not found",
          HTTP_RESPONSE_CODE.NOT_FOUND,
        );
      }
      this.handlePrismaError(error);
    }
  }

  async update(id: string, input: UpdateRepairCaseInput, userId: string) {
    try {
      return await this.repairCaseRepository.update(id, input, userId);
    } catch (error) {
      if ((error as Error).message === "NOT_FOUND") {
        throw createOperationalError(
          "Repair Case not found",
          HTTP_RESPONSE_CODE.NOT_FOUND,
        );
      }
      this.handlePrismaError(error);
    }
  }

  async grantAccessories(
    id: string,
    input: GrantAccessoriesInput,
    userId: string,
  ) {
    const caseRecord = await this.findOneById(id);
    try {
      return await this.repairCaseRepository.grantAccessories(
        id,
        caseRecord.ascCenterId,
        input.items,
        userId,
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw createOperationalError(
          "Out of stock or invalid accessory",
          HTTP_RESPONSE_CODE.BAD_REQUEST,
        );
      }
      this.handlePrismaError(error);
    }
  }

  async revokeAccessory(id: string, accessoryRowId: string, userId: string) {
    try {
      await this.repairCaseRepository.revokeAccessory(
        id,
        accessoryRowId,
        userId,
      );
    } catch (error) {
      if ((error as Error).message === "NOT_FOUND") {
        throw createOperationalError(
          "Row or Case not found",
          HTTP_RESPONSE_CODE.NOT_FOUND,
        );
      }
      this.handlePrismaError(error);
    }
  }

  async addImages(
    id: string,
    files: Express.Multer.File[],
    imageType: string,
    description: string | undefined,
    userId: string,
  ) {
    if (!files || files.length === 0) {
      throw createOperationalError(
        "No files provided",
        HTTP_RESPONSE_CODE.BAD_REQUEST,
      );
    }
    return this.repairCaseRepository.addImages(
      id,
      files,
      imageType,
      description,
      userId,
    );
  }

  async deleteImage(id: string, imageId: string) {
    try {
      const deletedImage = await this.repairCaseRepository.deleteImage(id, imageId);
      if (deletedImage && deletedImage.imagePath) {
        const fs = await import("fs");
        const path = await import("path");
        const UPLOADS_ROOT = path.resolve(process.cwd(), "uploads");
        const fullPath = path.resolve(UPLOADS_ROOT, deletedImage.imagePath);
        if (fullPath.startsWith(UPLOADS_ROOT) && fs.existsSync(fullPath)) {
          fs.promises.unlink(fullPath).catch(err => {
            console.error("Failed to delete image file from disk", err);
          });
        }
      }
    } catch (error) {
      if ((error as Error).message === "NOT_FOUND") {
        throw createOperationalError(
          "Image not found",
          HTTP_RESPONSE_CODE.NOT_FOUND,
        );
      }
      this.handlePrismaError(error);
    }
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw createOperationalError(
          "Record not found",
          HTTP_RESPONSE_CODE.NOT_FOUND,
        );
      }
      if (error.code === "P2003") {
        throw createOperationalError(
          "Foreign key constraint failed",
          HTTP_RESPONSE_CODE.BAD_REQUEST,
        );
      }
    }
    throw error as Error;
  }
}
