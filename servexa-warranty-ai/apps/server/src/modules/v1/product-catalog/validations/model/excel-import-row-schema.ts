import z from "zod";

export const excelImportRowSchema = z.object({
  modelCode: z.string().min(1),
  name: z.string().min(1),
  categoryId: z.uuidv7(),
  status: z.enum(["active", "inactive"]).optional(),
  laborCost: z.union([z.null(), z.number().nonnegative()]).optional(),
  inspectionCost: z.union([z.null(), z.number().nonnegative()]).optional(),
  stockNumber: z.number().int().nonnegative().optional(),
  image: z.string().nullable().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});
