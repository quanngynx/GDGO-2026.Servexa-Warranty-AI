import { PurchaseLocationsManagement } from '@/features/(SYSTEM-ADMINISTRATION)/purchase-locations-management'
import { createFileRoute } from '@tanstack/react-router'
import { adminListWithIsActiveSearchSchema } from '../../../../libs/search-schemas'

export const Route = createFileRoute(
  '/_authenticated/(SYSTEM-ADMINISTRATION)/purchase-locations-management/',
)({
  beforeLoad: () => ({ title: 'Purchase Locations Management' }),
  validateSearch: adminListWithIsActiveSearchSchema,
  component: PurchaseLocationsManagement,
})
