import { createFileRoute } from '@tanstack/react-router'
import { SettingsAccount } from '@/features/(SETTINGS)/settings-account'

export const Route = createFileRoute(
  '/_authenticated/(SETTINGS)/settings/account/',
)({
  beforeLoad: () => ({ title: 'Account Settings' }),
  component: SettingsAccount,
})
