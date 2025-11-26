import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/hot/dashboard/sermon-manager')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Sermon manager placeholder.</div>
}
