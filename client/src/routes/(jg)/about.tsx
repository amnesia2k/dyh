import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(jg)/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(jg)/about"!</div>
}
