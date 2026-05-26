import type { z } from "zod";

import type {
  CreateWarrantyPolicyDto,
  ReplaceWarrantyPolicyDto,
  ResolveWarrantyPolicyDto,
  UpdateWarrantyPolicyDto,
} from "../dtos/warranty-policy.dto";
import type { findAllWarrantyPoliciesSchema } from "../validations";
import type { BasePagination } from "src/types/pagination";
import type { WarrantyPolicy, Prisma } from "@servexa-warranty-ai/db/prisma/client";

type FindAllWarrantyPoliciesInput = z.infer<
  typeof findAllWarrantyPoliciesSchema
>;

export interface IWarrantyPolicyService {
  findAll(query: FindAllWarrantyPoliciesInput): Promise<{ items: (WarrantyPolicy & Prisma.WarrantyPolicyInclude)[] | null, pagination: BasePagination }>;
  findOneById(warrantyPolicyId: string): Promise<(WarrantyPolicy & Prisma.WarrantyPolicyInclude) | null>;
  create(input: CreateWarrantyPolicyDto): Promise<(WarrantyPolicy & Prisma.WarrantyPolicyInclude) | null>;
  update(
    warrantyPolicyId: string,
    input: ReplaceWarrantyPolicyDto | UpdateWarrantyPolicyDto,
  ): Promise<(WarrantyPolicy & Prisma.WarrantyPolicyInclude) | null>;
  delete(warrantyPolicyId: string): Promise<{ success: true }>;
  resolve(input: ResolveWarrantyPolicyDto): Promise<unknown>;
}
