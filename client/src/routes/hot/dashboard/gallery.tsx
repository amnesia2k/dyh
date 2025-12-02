import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/hot/dashboard/gallery')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/hot/dashboard/gallery"!</div>
}
