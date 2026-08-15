import { createFileRoute } from '@tanstack/react-router'
import { SettingsNotifications } from '@/features/(SETTINGS)/settings-notifications'

export const Route = createFileRoute(
  '/_authenticated/(SETTINGS)/settings/notifications/',
)({
  beforeLoad: () => ({ title: 'Notifications Settings' }),
  component: SettingsNotifications,
})
