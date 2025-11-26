import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/hot/dashboard/hot-management')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>HOT management tools are coming soon.</div>
}
