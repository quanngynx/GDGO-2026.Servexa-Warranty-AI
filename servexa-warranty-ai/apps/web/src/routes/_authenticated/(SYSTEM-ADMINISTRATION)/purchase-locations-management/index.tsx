import { PurchaseLocationsManagement } from '@/features/(SYSTEM-ADMINISTRATION)/purchase-locations-management'
import { createFileRoute } from '@tanstack/react-router'
import { adminListWithIsActiveSearchSchema } from '../search-schemas'

export const Route = createFileRoute(
  '/_authenticated/(SYSTEM-ADMINISTRATION)/purchase-locations-management/',
)({
  validateSearch: adminListWithIsActiveSearchSchema,
  component: PurchaseLocationsManagement,
})
