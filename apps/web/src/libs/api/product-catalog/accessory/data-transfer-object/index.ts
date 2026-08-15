import type { BasePagination } from '@/libs/api/bases/base-model'

export type RequestListAccessoriesDto = {
  page?: number
  limit?: number
  search?: string
  status?: 'active' | 'inactive'
  totalWarehouseIds?: string
  ascCenterIds?: string
}

export type ResponseAccessoryCategoryDto = {
  id: string
  name: string
  description?: string | null
}

export type ResponseAccessoryDto = {
  id: string
  name: string
  partNumber: string
  partGroupNumber?: string | null
  partGroupName?: string | null
  partDescription?: string | null
  itemNumber?: string | null
  englishName?: string | null
  description?: string | null
  image?: string | null
  imageUrl?: string | null
  unitPrice?: number | string | null
  customerPrice?: number | string | null
  status: 'active' | 'inactive'
  categoryId?: string | null
  category?: ResponseAccessoryCategoryDto | null
  createdAt: string
  updatedAt: string
}

export type ResponseAccessoryListDto = {
  items: ResponseAccessoryDto[]
  pagination: BasePagination
}

export type ResponseTotalWarehouseStockItemDto = {
  id: string
  totalWarehouseId: string
  accessoryId: string
  currentStock: number
  reservedStock: number
  availableStock: number
  minStockLevel: number
  maxStockLevel: number
  isLowStock: boolean
  needsRestock: boolean
  location?: string | null
  lastUpdated: string
  lastRestocked?: string | null
  accessory?: ResponseAccessoryDto | null
  totalWarehouse?: {
    id: string
    name: string
    address?: string
  } | null
}

export type ResponseTotalWarehouseAccessoryListDto = {
  items: ResponseTotalWarehouseStockItemDto[]
  pagination: BasePagination
}

export type ResponseAscStockItemDto = {
  id: string
  ascCenterId: string
  accessoryId: string
  currentStock: number
  reservedStock: number
  minStockLevel: number
  maxStockLevel: number
  currentQuantityFromLHTotalWarehouose?: number
  lastUpdated: string
  accessory?: ResponseAccessoryDto | null
  ascCenter?: {
    id: string
    name: string
    code?: string
  } | null
}

export type ResponseAscAccessoryListDto = {
  items: ResponseAscStockItemDto[]
  pagination: BasePagination
}

export type RequestCreateAccessoryDto = {
  name: string
  partNumber: string
  partGroupNumber?: string
  partGroupName?: string
  partDescription?: string
  itemNumber?: string
  englishName?: string
  description?: string
  unitPrice?: number
  customerPrice?: number
  status?: 'active' | 'inactive'
  categoryId?: string
}

export type RequestUpdateAccessoryDto = Partial<RequestCreateAccessoryDto>

export type RequestCreateTotalWarehouseStockDto = {
  accessoryId?: string
  currentStock: number
  minStockLevel?: number
  maxStockLevel?: number
  location?: string
  // Optional inline accessory creation fields
  name?: string
  partNumber?: string
  unitPrice?: number
  customerPrice?: number
  categoryId?: string
  status?: 'active' | 'inactive'
  description?: string
}

export type RequestUpdateTotalWarehouseStockDto = Partial<RequestCreateTotalWarehouseStockDto>

export type RequestCreateAscAccessoryStockDto = {
  accessoryId?: string
  currentStock: number
  minStockLevel?: number
  maxStockLevel?: number
  // Optional inline accessory creation fields
  name?: string
  partNumber?: string
  unitPrice?: number
  customerPrice?: number
  categoryId?: string
  status?: 'active' | 'inactive'
  description?: string
}

export type RequestUpdateAscAccessoryStockDto = Partial<RequestCreateAscAccessoryStockDto>

export type AccessoryApiResponse<T> = {
  message: string
  status: number
  metadata: T
}
