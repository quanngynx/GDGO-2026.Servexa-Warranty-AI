import prisma from "@servexa-warranty-ai/db";
import { Prisma, type TechnicianProfile } from "@servexa-warranty-ai/db/prisma/client";

import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant";
import { createOperationalError } from "@/middlewares/error-middleware";
import { buildPagination } from "@/utils/pagination";

import type {
  CreateTechnicianDto,
  ReplaceTechnicianDto,
  UpdateTechnicianDto,
} from "../dtos/technician.dto";
import type { ITechnicianRepository } from "../interfaces/technician-repository.interface";
import type { ITechnicianService } from "../interfaces/technician-service.interface";
import { TechnicianRepository } from "../repositories/technician.repository";
import type { BasePagination } from "src/types/pagination";

const technicianSelect = {
  id: true,
  userId: true,
  skillLevel: true,
  specializations: true,
  certifications: true,
  experienceYears: true,
  maxConcurrentCases: true,
  isAvailable: true,
  averageRepairTime: true,
  customerRating: true,
  completedCases: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.TechnicianProfileSelect;

export type FindAllTechniciansInput = {
  page: number;
  limit: number;
  sortBy: "createdAt" | "updatedAt" | "experienceYears" | "completedCases";
  sortOrder: "asc" | "desc";
  skillLevel?: "basic" | "intermediate" | "advanced" | "expert";
  isAvailable?: boolean;
  userId?: string;
  ascCenterId?: string;
};

export class TechnicianService implements ITechnicianService {
  constructor(
    private readonly technicianRepository: ITechnicianRepository = new TechnicianRepository(),
  ) {}

  private async ensureUserExists(userId: string) {
    const found = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!found)
      throw createOperationalError(
        "User not found",
        HTTP_RESPONSE_CODE.BAD_REQUEST,
      );
  }

  private async ensureAscCenterExists(ascCenterId: string) {
    const found = await prisma.ascCenter.findUnique({
      where: { id: ascCenterId },
      select: { id: true },
    });
    if (!found)
      throw createOperationalError(
        "ASC center not found",
        HTTP_RESPONSE_CODE.BAD_REQUEST,
      );
  }

  async findAll(query: FindAllTechniciansInput) {
    const where: Prisma.TechnicianProfileWhereInput = {
      ...(query.skillLevel ? { skillLevel: query.skillLevel } : {}),
      ...(query.isAvailable !== undefined
        ? { isAvailable: query.isAvailable }
        : {}),
      ...(query.userId ? { userId: query.userId } : {}),
      ...(query.ascCenterId ? { ascCenterId: query.ascCenterId } : {}),
    };

    const [items, total] = await Promise.all([
      this.technicianRepository.findAll({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { [query.sortBy]: query.sortOrder },
        select: {
          ...technicianSelect,
          user: {
            select: {
              fullName: true,
              username: true,
            },
          },
          ascCenter: {
            select: {
              centerName: true,
              centerCode: true,
            },
          },
          _count: {
            select: {
              repairCases: {
                where: {
                  status: {
                    notIn: ["hoanthanh", "dagiao", "suaxong"], // Not completed statuses
                  },
                },
              },
            },
          },
        },
      }),
      this.technicianRepository.count(where),
    ]);

    return {
      items,
      pagination: buildPagination(query.page, query.limit, total),
    };
  }

  async findOneById(technicianProfileId: string) {
    const found = await this.technicianRepository.findOneById(
      technicianProfileId,
      {
        select: technicianSelect,
      },
    );
    if (!found)
      throw createOperationalError(
        "Technician profile not found",
        HTTP_RESPONSE_CODE.NOT_FOUND,
      );
    return found;
  }

  async create(input: CreateTechnicianDto) {
    await this.ensureUserExists(input.userId);
    await this.ensureAscCenterExists(input.ascCenterId);
    const duplicate = (await this.technicianRepository.findOneByUserId(
      input.userId,
      {
        select: { id: true },
      },
    )) as { id: string } | null;
    if (duplicate) {
      throw createOperationalError(
        "Technician profile already exists for this user",
        HTTP_RESPONSE_CODE.CONFLICT,
      );
    }

    return this.technicianRepository.createOne(
      {
        user: { connect: { id: input.userId } },
        ascCenter: { connect: { id: input.ascCenterId } },
        skillLevel: input.skillLevel ?? "basic",
        specializations: input.specializations,
        certifications: input.certifications,
        experienceYears: input.experienceYears ?? 0,
        maxConcurrentCases: input.maxConcurrentCases ?? 5,
        isAvailable: input.isAvailable ?? true,
        averageRepairTime: input.averageRepairTime,
        customerRating:
          input.customerRating === undefined || input.customerRating === null
            ? null
            : new Prisma.Decimal(input.customerRating),
        completedCases: input.completedCases ?? 0,
      },
      { select: technicianSelect },
    );
  }

  async update(
    technicianProfileId: string,
    input: ReplaceTechnicianDto | UpdateTechnicianDto,
  ) {
    await this.findOneById(technicianProfileId);

    if (input.userId !== undefined) {
      await this.ensureUserExists(input.userId);
      const duplicate = (await this.technicianRepository.findOneByUserId(
        input.userId,
        {
          select: { id: true },
        },
      )) as { id: string } | null;
      if (duplicate && duplicate.id !== technicianProfileId) {
        throw createOperationalError(
          "User is already linked to another technician profile",
          HTTP_RESPONSE_CODE.CONFLICT,
        );
      }
    }
    if (input.ascCenterId !== undefined) {
      await this.ensureAscCenterExists(input.ascCenterId);
    }

    const data: Prisma.TechnicianProfileUpdateInput = {};
    if (input.userId !== undefined)
      data.user = { connect: { id: input.userId } };
    if (input.ascCenterId !== undefined)
      data.ascCenter = { connect: { id: input.ascCenterId } };
    if (input.skillLevel !== undefined) data.skillLevel = input.skillLevel;
    if (input.specializations !== undefined)
      data.specializations = input.specializations;
    if (input.certifications !== undefined)
      data.certifications = input.certifications;
    if (input.experienceYears !== undefined)
      data.experienceYears = input.experienceYears;
    if (input.maxConcurrentCases !== undefined)
      data.maxConcurrentCases = input.maxConcurrentCases;
    if (input.isAvailable !== undefined) data.isAvailable = input.isAvailable;
    if (input.averageRepairTime !== undefined)
      data.averageRepairTime = input.averageRepairTime;
    if (input.customerRating !== undefined) {
      data.customerRating =
        input.customerRating === null
          ? null
          : new Prisma.Decimal(input.customerRating);
    }
    if (input.completedCases !== undefined)
      data.completedCases = input.completedCases;

    if (Object.keys(data).length === 0) {
      throw createOperationalError(
        "No fields to update",
        HTTP_RESPONSE_CODE.BAD_REQUEST,
      );
    }

    return this.technicianRepository.updateOneById(technicianProfileId, data, {
      select: technicianSelect,
    });
  }

  async delete(technicianProfileId: string) {
    await this.findOneById(technicianProfileId);
    await this.technicianRepository.deleteById(technicianProfileId);
    return { success: true as const };
  }
}
