import { z } from 'zod'
import {
  findAllAccessoryRequestsSchema,
  createAccessoryRequestSchema,
  createAccessoryRequestItemSchema,
  updateAccessoryRequestSchema,
  updateAccessoryRequestItemSchema,
  approveAccessoryRequestSchema,
  approveAccessoryRequestItemSchema,
  rejectAccessoryRequestSchema,
  recallAccessoryRequestSchema,
} from '../validations'

export type FindAllAccessoryRequestsInput = z.infer<typeof findAllAccessoryRequestsSchema>['query']

export type CreateAccessoryRequestInput = z.infer<typeof createAccessoryRequestSchema>['body']
export type CreateAccessoryRequestItemInput = z.infer<typeof createAccessoryRequestItemSchema>

export type UpdateAccessoryRequestInput = z.infer<typeof updateAccessoryRequestSchema>['body']
export type UpdateAccessoryRequestItemInput = z.infer<typeof updateAccessoryRequestItemSchema>['body']

export type ApproveAccessoryRequestInput = z.infer<typeof approveAccessoryRequestSchema>['body']
export type ApproveAccessoryRequestItemInput = z.infer<typeof approveAccessoryRequestItemSchema>

export type RejectAccessoryRequestInput = z.infer<typeof rejectAccessoryRequestSchema>['body']

export type RecallAccessoryRequestInput = z.infer<typeof recallAccessoryRequestSchema>['body']
