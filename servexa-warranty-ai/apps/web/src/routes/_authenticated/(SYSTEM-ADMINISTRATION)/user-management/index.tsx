import { UserManagement } from '@/features/(SYSTEM-ADMINISTRATION)/user-management'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const userManagementSearchSchema = z.object({
  page: z.number().catch(1),
  pageSize: z.number().catch(10),
  username: z.string().catch(''),
  status: z.array(z.string()).catch([]),
  role: z.array(z.string()).catch([]),
})

export const Route = createFileRoute(
  '/_authenticated/(SYSTEM-ADMINISTRATION)/user-management/'
)({
  validateSearch: userManagementSearchSchema,
  component: UserManagement,
})
