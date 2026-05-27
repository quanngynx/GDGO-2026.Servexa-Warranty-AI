import { CentralWarehouseManagement } from '@/features/(SYSTEM-ADMINISTRATION)/central-warehouse-management'
import { createFileRoute } from '@tanstack/react-router'
import { adminListWithStatusSearchSchema } from '../../../../libs/search-schemas'

export const Route = createFileRoute(
  '/_authenticated/(SYSTEM-ADMINISTRATION)/central-warehouse-management/',
)({
  validateSearch: adminListWithStatusSearchSchema,
  component: CentralWarehouseManagement,
})
