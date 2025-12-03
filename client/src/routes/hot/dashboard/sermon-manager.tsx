import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { sermonsQueryOptions } from '@/hooks/dal/sermons'

export const Route = createFileRoute('/hot/dashboard/sermon-manager')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(sermonsQueryOptions()),
  component: RouteComponent,
})

function RouteComponent() {
  const sermons = useLoaderData({ from: Route.id })

  console.log('SERMONS >>>', sermons)

  return <div>Sermon manager placeholder.</div>
}
