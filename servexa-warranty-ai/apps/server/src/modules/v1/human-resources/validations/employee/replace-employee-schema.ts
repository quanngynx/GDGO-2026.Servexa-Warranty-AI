import { createEmployeeSchema } from './create-employee-schema'

export const replaceEmployeeSchema = createEmployeeSchema
export const updateEmployeeSchema = replaceEmployeeSchema.partial()
