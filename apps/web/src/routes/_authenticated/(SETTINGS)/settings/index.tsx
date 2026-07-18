import { createFileRoute } from '@tanstack/react-router'
import { Settings } from '@/features/(SETTINGS)/settings'

export const Route = createFileRoute(
  '/_authenticated/(SETTINGS)/settings/',
)({
  beforeLoad: () => ({ title: 'Settings' }),
  component: Settings,
})
