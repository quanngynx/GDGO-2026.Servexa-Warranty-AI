import { ProductCategoriesManagement } from '@/features/(SYSTEM-ADMINISTRATION)/product-categories-management'
import { createFileRoute } from '@tanstack/react-router'
import { adminListWithStatusSearchSchema } from '../../../../libs/search-schemas'

export const Route = createFileRoute(
  '/_authenticated/(SYSTEM-ADMINISTRATION)/product-categories-management/',
)({
  beforeLoad: () => ({ title: 'Product Categories Management' }),
  validateSearch: adminListWithStatusSearchSchema,
  component: ProductCategoriesManagement,
})
