import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { hotsQueryOptions } from '@/hooks/dal/hot'

export const Route = createFileRoute('/hot/dashboard/hot-management')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(hotsQueryOptions()),
  component: RouteComponent,
})

function RouteComponent() {
  const hot = useLoaderData({ from: Route.id })

  console.log('HOT >>>', hot)

  return <div>HOT management tools are coming soon.</div>
}
