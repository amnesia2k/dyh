import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { prayerRequestsQueryOptions } from '@/hooks/dal/prayer-requests'

export const Route = createFileRoute('/hot/dashboard/prayer-requests')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(prayerRequestsQueryOptions()),
  component: RouteComponent,
})

function RouteComponent() {
  const prayerRequests = useLoaderData({ from: Route.id })

  console.log('PRAYER REQUESTS >>>', prayerRequests)

  return <div>Prayer requests will be managed here.</div>
}
