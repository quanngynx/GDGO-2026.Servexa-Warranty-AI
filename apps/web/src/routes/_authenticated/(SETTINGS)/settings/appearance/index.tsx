import { createFileRoute } from '@tanstack/react-router'
import { SettingsAppearance } from '@/features/(SETTINGS)/settings-appearance'

export const Route = createFileRoute(
  '/_authenticated/(SETTINGS)/settings/appearance/',
)({
  beforeLoad: () => ({ title: 'Appearance Settings' }),
  component: SettingsAppearance,
})
