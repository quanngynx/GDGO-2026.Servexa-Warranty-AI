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
  RepairCase,
  RepairCaseAccessory,
  RepairCaseImage,
  AscCenter,
  Customer,
  Model,
  Solution,
} from '@servexa-warranty-ai/db/prisma/client'

export type FindAllRepairCasesInput = z.infer<typeof findAllRepairCasesSchema>['query']
export type FindWaitingAccessoriesInput = z.infer<typeof findWaitingAccessoriesSchema>['query']
export type CreateRepairCaseInput = z.infer<typeof createRepairCaseSchema>['body']
export type ReplaceRepairCaseInput = z.infer<typeof replaceRepairCaseSchema>['body']
export type UpdateRepairCaseInput = z.infer<typeof updateRepairCaseSchema>['body']
export type GrantAccessoriesInput = z.infer<typeof grantAccessoriesSchema>['body']
export type UploadImagesInput = z.infer<typeof uploadImagesSchema>['body']
export type ExportRepairCasesInput = z.infer<typeof exportRepairCasesSchema>['query']

export type RepairCaseListItem = Pick<
  RepairCase,
  | 'id'
  | 'caseNumber'
  | 'ascCenterId'
  | 'customerId'
  | 'status'
  | 'priority'
  | 'serialNumber'
  | 'receivedDate'
  | 'createdAt'
> & {
  ascCenter: Pick<AscCenter, 'centerName' | 'centerCode'>
  customer: Pick<Customer, 'fullName' | 'phone1'>
  model?: Pick<Model, 'name' | 'modelCode'> | null
}

export type RepairCaseDetail = RepairCase & {
  ascCenter: AscCenter
  customer: Customer
  model: Model | null
  solution: Solution | null
  _count: {
    accessories: number
    images: number
    statusHistory: number
    fieldHistory: number
    accessoryRequest: number
  }
}

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
