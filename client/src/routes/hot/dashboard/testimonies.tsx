import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { testimoniesQueryOptions } from '@/hooks/dal/testimonies'

export const Route = createFileRoute('/hot/dashboard/testimonies')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(testimoniesQueryOptions()),
  component: RouteComponent,
})

function RouteComponent() {
  const testimonies = useLoaderData({ from: Route.id })

  console.log('TESTIMONIES >>>', testimonies)

  return <div>Testimonies placeholder page.</div>
}
