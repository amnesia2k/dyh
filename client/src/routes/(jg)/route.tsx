import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(jg)')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main>
      <Outlet />
    </main>
  )
}
