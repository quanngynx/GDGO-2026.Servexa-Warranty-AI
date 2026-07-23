import type {
  ResponseAccessoryDto,
  ResponseAscStockItemDto,
  ResponseTotalWarehouseStockItemDto,
} from '@/libs/api/product-catalog/accessory/data-transfer-object'

export type AccessoryItem = ResponseAccessoryDto &
  Partial<ResponseTotalWarehouseStockItemDto> &
  Partial<ResponseAscStockItemDto>

export type Accessory = AccessoryItem
