import { z } from "zod/v4";

export const baseListQuerySchema = z.object({
  pageNumber: z.number().min(1).default(1),
  pageSize: z.number().min(1).default(10),
  searchTerm: z.string().default(""),
  sortBy: z.string().optional(),
  isDescending: z.boolean().optional(),
});

export const basePaginationSchema = z.object({
  totalCount: z.number(),
  pageNumber: z.number(),
  totalPages: z.number(),
  // totalItems: z.number(),
  hasPreviousPage: z.boolean(),
  hasNextPage: z.boolean(),
});
