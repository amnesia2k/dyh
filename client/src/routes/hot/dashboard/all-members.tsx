import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/hot/dashboard/all-members')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>All members view coming soon.</div>
}
