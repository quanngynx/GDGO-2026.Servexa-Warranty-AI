import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/ai/gemini/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/ai/gemini/"!</div>
}
