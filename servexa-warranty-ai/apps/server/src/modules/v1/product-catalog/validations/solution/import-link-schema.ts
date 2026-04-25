import z from 'zod'

export const importLinkSchema = z.object({
  url: z.url(),
})
