import { createTechnicianSchema } from './create-technician-schema'

export const replaceTechnicianSchema = createTechnicianSchema
export const updateTechnicianSchema = replaceTechnicianSchema.partial()
