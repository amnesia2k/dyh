import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { announcementsQueryOptions } from '@/hooks/dal/announcements'

export const Route = createFileRoute('/hot/dashboard/announcements')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(announcementsQueryOptions()),
  component: RouteComponent,
})

function RouteComponent() {
  const announcements = useLoaderData({ from: Route.id })

  console.log('ANNOUNCEMENTS >>>', announcements)

  return <div>Announcements will live here.</div>
}
