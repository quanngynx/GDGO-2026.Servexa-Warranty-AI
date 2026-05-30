import type { Prisma } from '@servexa-warranty-ai/db/prisma/client';

export const ascStocktakeListSelect = {
  id: true,
  ascCenterId: true,
  notes: true,
  createdBy: true,
  createdAt: true,
  ascCenter: { select: { id: true, centerName: true, centerCode: true } },
  creator: { select: { id: true, fullName: true, companyEmail: true } },
  _count: { select: { items: true } },
} satisfies Prisma.AscStocktakeSelect;

export const ascStocktakeDetailInclude = {
  ascCenter: { select: { id: true, centerName: true, centerCode: true } },
  creator: { select: { id: true, fullName: true, companyEmail: true } },
  items: {
    include: {
      accessory: { select: { id: true, name: true, partNumber: true, unitPrice: true } },
    },
    orderBy: { id: 'asc' as const },
  },
} satisfies Prisma.AscStocktakeInclude;

export const ascStocktakeAccessorySelect = {
  id: true,
  name: true,
  partNumber: true,
  partGroupName: true,
  unitPrice: true,
  category: { select: { id: true, name: true } },
  stockLevels: {
    select: {
      currentStock: true,
      reservedStock: true,
      minStockLevel: true,
      lastUpdated: true,
    },
  },
} satisfies Prisma.AccessorySelect;

export const ascStocktakeStockLevelInclude = {
  accessory: {
    select: {
      id: true,
      name: true,
      partNumber: true,
      partGroupName: true,
      unitPrice: true,
      category: { select: { id: true, name: true } },
    },
  },
} satisfies Prisma.AscAccessoryStockInclude;

export type AscStocktakeListItem = Prisma.AscStocktakeGetPayload<{
  select: typeof ascStocktakeListSelect;
}>;

export type AscStocktakeDetail = Prisma.AscStocktakeGetPayload<{
  include: typeof ascStocktakeDetailInclude;
}>;

export type AscStocktakeAccessoryRow = Prisma.AccessoryGetPayload<{
  select: typeof ascStocktakeAccessorySelect;
}>;

export type AscStocktakeStockLevelRow = Prisma.AscAccessoryStockGetPayload<{
  include: typeof ascStocktakeStockLevelInclude;
}>;
