import { AccessoriesManagement } from '@/features/(SYSTEM-ADMINISTRATION)/accessories-management'
import { createFileRoute } from '@tanstack/react-router'
import { adminListWithWarehouseSearchSchema } from '../../../../libs/search-schemas'

export const Route = createFileRoute(
  '/_authenticated/(SYSTEM-ADMINISTRATION)/accessories-management/',
)({
  validateSearch: adminListWithWarehouseSearchSchema,
  component: AccessoriesManagement,
})
