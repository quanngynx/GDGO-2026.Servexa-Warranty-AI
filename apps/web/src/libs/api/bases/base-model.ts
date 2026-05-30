import z from "zod/v4";
import { basePaginationSchema } from "./base-schema";

export interface PrimaryKey {
  id: string;
}

export interface Audit {
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface Paranoid {
  deletedAt: Date | null
}

export interface BaseFilter {
  pageIndex: number;
  pageSize: number;
  keySearch: string;
}

export type BasePagination = z.infer<typeof basePaginationSchema>;
