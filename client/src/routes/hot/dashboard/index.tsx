import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/hot/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="text-lg font-semibold">Head of Tribes Dashboard</div>
}
