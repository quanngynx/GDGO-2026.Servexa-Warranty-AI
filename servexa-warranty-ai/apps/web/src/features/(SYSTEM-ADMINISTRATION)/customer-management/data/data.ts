import { Building2, Store, User, Users } from 'lucide-react'
import type { CustomerGroup } from './schema'

export const customerGroups = new Map<CustomerGroup, string>([
  ['individual', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['dealer_store', 'bg-blue-100/30 text-blue-900 dark:text-blue-200 border-blue-200'],
  ['company', 'bg-violet-100/30 text-violet-900 dark:text-violet-200 border-violet-200'],
  ['supplier', 'bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-200'],
  ['invoice', 'bg-neutral-300/40 border-neutral-300'],
  ['store_representative', 'bg-neutral-300/40 border-neutral-300'],
])

export const customerGroupOptions = [
  { label: 'Individual', value: 'individual' as const, icon: User },
  { label: 'Dealer store', value: 'dealer_store' as const, icon: Store },
  { label: 'Company', value: 'company' as const, icon: Building2 },
  { label: 'Supplier', value: 'supplier' as const, icon: Users },
  { label: 'Invoice', value: 'invoice' as const, icon: Users },
  { label: 'Store representative', value: 'store_representative' as const, icon: Users },
]
