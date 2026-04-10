import { z } from "zod";

const customerGroupSchema = z.union([
  z.literal("individual"),
  z.literal("other"),
]);
export type CustomerGroup = z.infer<typeof customerGroupSchema>;

const customerSchema = z.object({
  id: z.string(),
  customerGroup: customerGroupSchema,
  fullname: z.string(),
  email: z.string(),
  phone1: z.string(),
  phone2: z.string(),
  province: z.string(),
  ward: z.string(),
  address: z.string(),
  taxCode: z.string(),
  bankName: z.string(),
  accountNumber: z.string(),
  contactPerson: z.string(),
  ascCenter: z
    .object({
      id: z.string(),
      centerName: z.string(),
      centerCode: z.string(),
    })
    .nullable()
    .optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  createdBy: z.string(),
  updatedBy: z.string().nullable().optional(),
  _count: z.object({
    repairCases: z.number(),
  }),
});
export type Customer = z.infer<typeof customerSchema>;

export const customerListSchema = z.array(customerSchema);
