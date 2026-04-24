import z from 'zod'

export const documentTypeSchema = z.enum(['TECHNICAL', 'PROCESS', 'USER_MANUAL'])
