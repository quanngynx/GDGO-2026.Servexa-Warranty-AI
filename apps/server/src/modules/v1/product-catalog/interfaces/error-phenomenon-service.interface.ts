import type {
  CreateErrorPhenomenonDto,
  ReplaceErrorPhenomenonDto,
  UpdateErrorPhenomenonDto,
} from "../dtos/error-phenomenon.dto";
import type { FindAllErrorPhenomenaInput } from "../services/error-phenomenon.service";
import {
  type ErrorPhenomenon,
  Prisma,
} from "@/core/infra/prisma/generated/client";
import type { BasePagination } from "@/types/pagination";

export interface IErrorPhenomenonService {
  findAll(
    query: FindAllErrorPhenomenaInput,
  ): Promise<{
    items: (ErrorPhenomenon & Prisma.ErrorPhenomenonInclude)[] | null;
    pagination: BasePagination;
  }>;
  findOneById(
    errorPhenomenonId: string,
  ): Promise<(ErrorPhenomenon & Prisma.ErrorPhenomenonInclude) | null>;
  create(
    input: CreateErrorPhenomenonDto,
  ): Promise<(ErrorPhenomenon & Prisma.ErrorPhenomenonInclude) | null>;
  update(
    errorPhenomenonId: string,
    input: ReplaceErrorPhenomenonDto | UpdateErrorPhenomenonDto,
  ): Promise<(ErrorPhenomenon & Prisma.ErrorPhenomenonInclude) | null>;
  delete(errorPhenomenonId: string): Promise<{ success: true }>;
}
