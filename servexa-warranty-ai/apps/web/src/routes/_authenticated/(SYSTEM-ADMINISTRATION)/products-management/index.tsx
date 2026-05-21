import { ProductsManagement } from '@/features/(SYSTEM-ADMINISTRATION)/products-management'
import { createFileRoute } from '@tanstack/react-router'
import { adminListWithStatusSearchSchema } from '../search-schemas'

export const Route = createFileRoute(
  '/_authenticated/(SYSTEM-ADMINISTRATION)/products-management/',
)({
  validateSearch: adminListWithStatusSearchSchema,
  component: ProductsManagement,
})
