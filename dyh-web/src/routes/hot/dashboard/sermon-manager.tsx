import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/hot/dashboard/sermon-manager')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/hot/dashboard/sermon-manager"!</div>
}
