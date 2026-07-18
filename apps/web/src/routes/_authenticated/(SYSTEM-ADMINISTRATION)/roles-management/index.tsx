import { RolesManagement } from '@/features/(SYSTEM-ADMINISTRATION)/roles-management'
import { createFileRoute } from '@tanstack/react-router'
import { adminListSearchSchema } from '../../../../libs/search-schemas'

export const Route = createFileRoute(
  '/_authenticated/(SYSTEM-ADMINISTRATION)/roles-management/',
)({
  beforeLoad: () => ({ title: 'Roles Management' }),
  validateSearch: adminListSearchSchema,
  component: RolesManagement,
})
