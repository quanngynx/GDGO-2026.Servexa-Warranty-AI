import type z from 'zod/v4'
import type {
  requestForgotPasswordSchema,
  requestLoginValidation,
  requestChangePasswordSchema,
} from '../validations'

// ===============================================
// API Request Data Transfer Object
// ===============================================
export type RequestLoginDto = z.infer<typeof requestLoginValidation>
export type RequestForgotPasswordDto = z.infer<
  typeof requestForgotPasswordSchema
>
export type RequestChangePasswordDto = z.infer<
  typeof requestChangePasswordSchema
>

// Server wraps payloads as JSON: { message, status, metadata }
export type ServerSuccessResponse<TMetadata> = {
  message: string
  status: number
  metadata: TMetadata
}

export type ResponseAuthUserDto = {
  id: string
  username: string
  fullName: string
  email: string
  role: string
  permissions?: string[] | undefined
}

export type ResponseAuthTokensDto = {
  user: ResponseAuthUserDto
  accessToken: string
  refreshToken: string
  expiresInAccessToken: number
  expiresInRefreshToken: number
}

export type ResponseLoginDto = ServerSuccessResponse<ResponseAuthTokensDto>
export type ResponseRefreshTokenDto = ServerSuccessResponse<ResponseAuthTokensDto>

/** Current user from GET /me (matches server currentUserQuerySchema) */
export type ResponseMeUserDto = {
  id: string
  email: string
  username: string
  fullName: string
  role: string
  roleScope?: string | undefined
  permissions?: string[] | undefined
}

export type ResponseVerifyDto = ServerSuccessResponse<ResponseMeUserDto>

export type ResponseLogoutDto = ServerSuccessResponse<boolean>

export type ResponseChangePasswordDto = boolean
export type ResponseForgotPasswordDto = boolean
