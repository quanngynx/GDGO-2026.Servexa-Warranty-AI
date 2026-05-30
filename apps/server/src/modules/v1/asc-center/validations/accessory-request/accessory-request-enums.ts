import { z } from 'zod'
import {
  AccessoryRequestUrgency,
  AccessoryRequestStatus,
  StatusRecall,
  AccessoryRequestItemStatus,
} from '@servexa-warranty-ai/db/prisma/client'

export const accessoryRequestUrgencySchema = z.enum(AccessoryRequestUrgency)
export const accessoryRequestStatusSchema = z.enum(AccessoryRequestStatus)
export const statusRecallSchema = z.enum(StatusRecall)
export const accessoryRequestItemStatusSchema = z.enum(AccessoryRequestItemStatus)
