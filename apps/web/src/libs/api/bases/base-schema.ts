import { z } from "zod/v4";

export const baseListQuerySchema = z.object({
  pageNumber: z.number().min(1).default(1),
  pageSize: z.number().min(1).default(10),
  searchTerm: z.string().default(""),
  sortBy: z.string().optional(),
  isDescending: z.boolean().optional(),
});

export const basePaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});
