import { createFileRoute } from '@tanstack/react-router'
import { SettingsDisplay } from '@/features/(SETTINGS)/settings-display'

export const Route = createFileRoute(
  '/_authenticated/(SETTINGS)/settings/display/',
)({
  beforeLoad: () => ({ title: 'Display Settings' }),
  component: SettingsDisplay,
})
