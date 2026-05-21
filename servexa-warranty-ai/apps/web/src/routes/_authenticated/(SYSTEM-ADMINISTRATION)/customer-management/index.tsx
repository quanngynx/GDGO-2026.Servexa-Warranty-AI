import { CustomerManagement } from '@/features/(SYSTEM-ADMINISTRATION)/customer-management'
import { createFileRoute } from '@tanstack/react-router'
import { adminListSearchSchema } from '../search-schemas'

export const Route = createFileRoute(
  '/_authenticated/(SYSTEM-ADMINISTRATION)/customer-management/',
)({
  validateSearch: adminListSearchSchema,
  component: CustomerManagement,
})
