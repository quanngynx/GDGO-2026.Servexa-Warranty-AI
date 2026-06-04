import { z } from 'zod'
import {
  findAllRepairCasesSchema,
  findWaitingAccessoriesSchema,
  createRepairCaseSchema,
  replaceRepairCaseSchema,
  updateRepairCaseSchema,
  grantAccessoriesSchema,
  uploadImagesSchema,
  exportRepairCasesSchema,
} from '../validations'
import type {
  RepairCaseAccessory,
  RepairCaseImage,
} from '@/core/infra/prisma/generated/client'

export type FindAllRepairCasesInput = z.infer<typeof findAllRepairCasesSchema>['query']
export type FindWaitingAccessoriesInput = z.infer<typeof findWaitingAccessoriesSchema>['query']
export type CreateRepairCaseInput = z.infer<typeof createRepairCaseSchema>['body']
export type ReplaceRepairCaseInput = z.infer<typeof replaceRepairCaseSchema>['body']
export type UpdateRepairCaseInput = z.infer<typeof updateRepairCaseSchema>['body']
export type GrantAccessoriesInput = z.infer<typeof grantAccessoriesSchema>['body']
export type UploadImagesInput = z.infer<typeof uploadImagesSchema>['body']
export type ExportRepairCasesInput = z.infer<typeof exportRepairCasesSchema>['query']

export type {
  RepairCaseListItem,
  RepairCaseDetail,
} from '../repair-case.types'

export type GrantedAccessoryDto = RepairCaseAccessory & {
  accessory: {
    partNumber: string
    name: string
  }
  addedByUser: {
    fullName: string
  }
}

export type RepairCaseImageDto = RepairCaseImage & {
  uploader: {
    fullName: string
  }
}
