import { createCustomerSchema } from './create-customer-schema'

export const replaceCustomerSchema = createCustomerSchema
export const updateCustomerSchema = replaceCustomerSchema.partial()
