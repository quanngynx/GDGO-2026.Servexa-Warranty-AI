import { z } from 'zod'
import {
  RepairCaseStatus,
  RepairCasePriority,
  RepairCaseImageType,
  WarrantyForm,
  WarrantyServiceType,
  StatusRecall,
} from '@/core/infra/prisma/generated/client'

export const repairCaseStatusSchema = z.enum(RepairCaseStatus)
export const repairCasePrioritySchema = z.enum(RepairCasePriority)
export const repairCaseImageTypeSchema = z.enum(RepairCaseImageType)
export const warrantyFormSchema = z.enum(WarrantyForm)
export const warrantyServiceTypeSchema = z.enum(WarrantyServiceType)
export const statusRecallSchema = z.enum(StatusRecall)

export const repairCaseBaseShape = {
  customerId: z.uuidv7(),
  priority: repairCasePrioritySchema.optional().default('normal'),
  modelId: z.uuidv7().optional(),
  serialNumber: z.string().optional(),
  warrantyForm: warrantyFormSchema.optional(),
  warrantyServiceType: warrantyServiceTypeSchema.optional(),
  solutionId: z.uuidv7().optional(),
  damageDescription: z.string(),
  receivedDate: z.coerce.date(),
  estimatedCompletionDate: z.coerce.date().optional(),
  promisedDeliveryDate: z.coerce.date().optional(),
  
  status: repairCaseStatusSchema.optional(),
  statusReason: z.string().optional(),
  statusNotes: z.string().optional(),
  warrantyResolution: z.string().optional(),
  statusRecall: statusRecallSchema.optional(),
  
  totalCost: z.coerce.number().min(0).optional(),
  laborCost: z.coerce.number().min(0).optional(),
  partsCost: z.coerce.number().min(0).optional(),
  serviceFee: z.coerce.number().min(0).optional(),
  shippingCost: z.coerce.number().min(0).optional(),
  discountAmount: z.coerce.number().min(0).optional(),
  otherFee: z.coerce.number().min(0).optional(),
  otherFeeNote: z.string().optional(),
  
  technicianName: z.string().optional(),
  repairNotes: z.string().optional(),
}
