import { z } from "zod";

const userStatusSchema = z.union([
  z.literal("active"),
  z.literal("inactive"),
  z.literal("invited"),
  z.literal("suspended"),
]);
export type UserStatus = z.infer<typeof userStatusSchema>;

const userRoleSchema = z.union([
  z.literal("superadmin"),
  z.literal("admin"),
  z.literal("cashier"),
  z.literal("manager"),
]);

const userSchema = z.object({
  id: z.string(),
  fullname: z.string(),
  username: z.string(),
  companyEmail: z.string(),
  personalEmail: z.string(),
  phoneNumber: z.string(),
  avatar: z.string(),
  status: userStatusSchema,
  role: userRoleSchema,
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
  createdBy: z.string().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
});
export type User = z.infer<typeof userSchema>;

export const userListSchema = z.array(userSchema);
