import type z from "zod/v4";
import type {
  requestForgotPasswordSchema,
  requestLoginValidation,
  requestChangePasswordSchema,
} from "../validations";
import type { BaseApiResponse } from "../../bases/base-response";
import type { UserStatus } from "@servexa-warranty-ai/ui/enums/business-status";

// ===============================================
// API Request Data Transfer Object
// ===============================================
//
// ===============================================
export type RequestLoginDto = z.infer<typeof requestLoginValidation>;
export type RequestForgotPasswordDto = z.infer<
  typeof requestForgotPasswordSchema
>;
export type RequestChangePasswordDto = z.infer<
  typeof requestChangePasswordSchema
>;

// ===============================================
// API Response Data Transfer Object
// ===============================================
//
// ===============================================
export type ResponseDataVerifyDto = {
  id: string;
  username: string;
  fullName: string;
  role: string;
  status: UserStatus;
  email?: string | null | undefined;
  permissions?: string[] | undefined;
};

export type ResponseLoginDto = BaseApiResponse<{
  id: number;
  username: string;
  fullName: string;
  email: string;
  token: string;
}>;

export type ResponseVerifyDto = BaseApiResponse<ResponseDataVerifyDto>;

export type ResponseLogoutDto = BaseApiResponse<boolean>;

export type ResponseRefreshTokenDto = BaseApiResponse<{
  user: {
    id: string;
    username: string;
    fullName: string;
    role: string;
    status: UserStatus;
    email?: string | null | undefined;
    permissions?: string[] | undefined;
  };
  accessToken: string;
  refreshToken: string;
  expiresInAccessToken: number;
  expiresInRefreshToken: number;
  iatAccessToken: number;
  iatRefreshToken: number;
}>;

export type ResponseChangePasswordDto = boolean;
export type ResponseForgotPasswordDto = boolean;
