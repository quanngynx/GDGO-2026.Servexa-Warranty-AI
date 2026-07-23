import { ProductsManagement } from '@/features/(SYSTEM-ADMINISTRATION)/products-management'
import { createFileRoute } from '@tanstack/react-router'
import { adminListWithStatusSearchSchema } from '../../../../libs/search-schemas'

export const Route = createFileRoute(
  '/_authenticated/(SYSTEM-ADMINISTRATION)/products-management/',
)({
  beforeLoad: () => ({ title: 'Products Management' }),
  validateSearch: adminListWithStatusSearchSchema,
  component: ProductsManagement,
})
