import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/hot/dashboard/prayer-requests')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Prayer requests will be managed here.</div>
}
