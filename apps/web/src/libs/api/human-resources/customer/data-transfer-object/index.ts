import type { BasePagination } from '@/libs/api/bases/base-model'

export type CustomerGroup =
  | 'individual'
  | 'dealer_store'
  | 'store_representative'
  | 'supplier'
  | 'invoice'
  | 'company'

export type RequestListCustomersDto = {
  page?: number
  limit?: number
  search?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'fullName' | 'phone1'
  sortOrder?: 'asc' | 'desc'
  customerGroup?: CustomerGroup
  ascCenterId?: string
}

export type RequestCreateCustomerDto = {
  customerGroup: CustomerGroup
  fullName: string
  phone1: string
  phone2?: string
  email?: string
  provinceId?: string
  wardId?: string
  address?: string
  taxCode?: string
  bankName?: string
  accountNumber?: string
  contactPerson?: string
  ascCenterId?: string
}

export type RequestUpdateCustomerDto = Partial<RequestCreateCustomerDto>

export type ResponseCustomerDto = {
  id: string
  customerGroup: CustomerGroup
  fullName: string
  phone1: string
  phone2: string | null
  email: string | null
  provinceId: string | null
  wardId: string | null
  address: string | null
  taxCode: string | null
  bankName: string | null
  accountNumber: string | null
  contactPerson: string | null
  ascCenterId: string | null
  createdAt: string
  updatedAt: string
}

export type ResponseCustomerListDto = {
  items: ResponseCustomerDto[]
  pagination: BasePagination
}

export type CustomerApiResponse<T> = {
  message: string
  status: number
  metadata: T
}
