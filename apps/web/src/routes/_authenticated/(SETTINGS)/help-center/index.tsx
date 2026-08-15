import { createFileRoute } from '@tanstack/react-router'
import { HelpCenter } from '@/features/(SETTINGS)/help-center'

export const Route = createFileRoute(
  '/_authenticated/(SETTINGS)/help-center/',
)({
  beforeLoad: () => ({ title: 'Help Center' }),
  component: HelpCenter,
})
