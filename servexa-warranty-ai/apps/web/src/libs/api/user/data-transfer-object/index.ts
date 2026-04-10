import type { BasePagination } from '@/libs/api/bases/base-model'
import type { UserRole, UserStatus } from '@/features/(SYSTEM-ADMINISTRATION)/user-management/data/schema'

// ===============================================
// Request DTOs
// ===============================================

/** Query params for GET /v1/identity/users (see server `findAllUsersSchema`) */
export type RequestListUsersDto = {
  page?: number
  limit?: number
  search?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'username' | 'fullName'
  sortOrder?: 'asc' | 'desc'
  status?: 'active' | 'inactive' | 'suspended'
}

export type RequestCreateUserDto = {
  firstName: string
  lastName: string
  username: string
  email: string
  phoneNumber: string
  role: UserRole
  password: string
}

export type RequestUpdateUserDto = Partial<Omit<RequestCreateUserDto, 'password'>> & {
  password?: string
}

// ===============================================
// Response DTOs
// ===============================================

export type ResponseUserDto = {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: UserRole
  status: UserStatus
  avatar?: string | null
  ascCenter?: {
    id: string
    centerName: string
    centerCode: string
  } | null
  createdAt: string
  updatedAt: string
  createdBy?: string | null
  updatedBy?: string | null
  isDeleted?: boolean
}

export type ResponseUserListDto = {
  items: ResponseUserDto[]
  pagination: BasePagination
}

/** Matches server `SuccessResponse.send` JSON shape */
export type UserApiResponse<T> = {
  message: string
  status: number
  metadata: T
}
