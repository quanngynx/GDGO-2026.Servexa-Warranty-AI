import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/(GENERAL)/repair-cases-management',
)({
  beforeLoad: () => ({
    title: 'Repair Cases Management',
  }),
  component: Outlet,
})
