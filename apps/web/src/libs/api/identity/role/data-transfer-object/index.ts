export type RequestListRolesDto = {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type ResponseRoleDto = {
  id: string
  name: string
  description: string | null
  createdAt: string
}

export type RequestCreateRoleDto = {
  name: string
  description?: string
}

export type RoleApiResponse<T> = {
  message: string
  status: number
  metadata: T
}
