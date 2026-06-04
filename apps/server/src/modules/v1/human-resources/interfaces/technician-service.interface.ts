import type { BasePagination } from "src/types/pagination";
import type {
  CreateTechnicianDto,
  ReplaceTechnicianDto,
  UpdateTechnicianDto,
} from "../dtos/technician.dto";
import type { FindAllTechniciansInput } from "../services/technician.service";
import {
  Prisma,
  type TechnicianProfile,
} from "@/core/infra/prisma/generated/client";

export interface ITechnicianService {
  findAll(
    query: FindAllTechniciansInput,
  ): Promise<{
    items:
      | (TechnicianProfile & Prisma.TechnicianProfileInclude)[]
      | null
      | undefined;
    pagination: BasePagination;
  }>;
  findOneById(
    technicianProfileId: string,
  ): Promise<
    (TechnicianProfile & Prisma.TechnicianProfileInclude) | null | undefined
  >;
  create(input: CreateTechnicianDto): Promise<unknown>;
  update(
    technicianProfileId: string,
    input: ReplaceTechnicianDto | UpdateTechnicianDto,
  ): Promise<unknown>;
  delete(technicianProfileId: string): Promise<{ success: true }>;
}
