import { z } from 'zod'
import {
  AccessoryRequestUrgency,
  AccessoryRequestStatus,
  StatusRecall,
  AccessoryRequestItemStatus,
} from '@/core/infra/prisma/generated/enums'

export const accessoryRequestUrgencySchema = z.enum(AccessoryRequestUrgency)
export const accessoryRequestStatusSchema = z.enum(AccessoryRequestStatus)
export const statusRecallSchema = z.enum(StatusRecall)
export const accessoryRequestItemStatusSchema = z.enum(AccessoryRequestItemStatus)
