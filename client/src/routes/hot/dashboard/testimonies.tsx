import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/hot/dashboard/testimonies')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Testimonies placeholder page.</div>
}
