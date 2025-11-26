import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/hot/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/hot/dashboard/"!</div>
}
