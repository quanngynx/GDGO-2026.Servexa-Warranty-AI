import type { ImportHeader } from "./model-excel.type";

export const ALL_HEADERS: readonly ImportHeader[] = [
  'modelCode',
  'name',
  'categoryId',
  'status',
  'laborCost',
  'inspectionCost',
  'stockNumber',
  'image',
  'createdAt',
  'updatedAt',
];

export const REQUIRED_HEADERS: readonly ImportHeader[] = [
  'modelCode',
  'name',
  'categoryId',
];