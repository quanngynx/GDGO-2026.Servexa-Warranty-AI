import { CreditCard, Shield, UserCheck, Users } from 'lucide-react'

export const statusTypes = new Map<string, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
  ['suspended', 'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-white border-destructive/10'],
])

/** Legacy scaffold for action dialog until domain create/edit forms are implemented */
export const roles = [
  { label: 'Superadmin', value: 'superadmin', icon: Shield },
  { label: 'Admin', value: 'admin', icon: UserCheck },
  { label: 'Manager', value: 'manager', icon: Users },
  { label: 'Cashier', value: 'cashier', icon: CreditCard },
] as const
