import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/hot/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(auth)/login"!</div>
}
