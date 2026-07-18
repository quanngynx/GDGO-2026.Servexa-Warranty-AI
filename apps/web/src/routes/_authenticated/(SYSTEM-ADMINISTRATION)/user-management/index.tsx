import { UserManagement } from '@/features/(SYSTEM-ADMINISTRATION)/user-management'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { adminListSearchSchema } from '../../../../libs/search-schemas'

const userManagementSearchSchema = adminListSearchSchema.extend({
  username: z.string().default(''),
  status: z.array(z.string()).default([]),
})

export const Route = createFileRoute(
  '/_authenticated/(SYSTEM-ADMINISTRATION)/user-management/',
)({
  beforeLoad: () => ({ title: 'User Management' }),
  validateSearch: userManagementSearchSchema,
  component: UserManagement,
})
