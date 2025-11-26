import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/hot/dashboard/announcements')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Announcements will live here.</div>
}
