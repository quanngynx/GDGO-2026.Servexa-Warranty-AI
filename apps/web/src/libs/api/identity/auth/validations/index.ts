import z from "zod/v4";

export const requestLoginValidation = z.object({
  username: z.string().min(1),
  password: z.string().min(8),
});

export const requestChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(1, "New password is required"),
  confirmNewPassword: z.string().min(1, "Confirm new password is required"),
});

export const requestForgotPasswordSchema = z.object({
  email: z.string().min(1, "Email is required"),
});
