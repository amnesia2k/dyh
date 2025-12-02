import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { membersQueryOptions } from '@/hooks/dal/members'

export const Route = createFileRoute('/hot/dashboard/all-members')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(membersQueryOptions()),
  component: RouteComponent,
})

function RouteComponent() {
  const members = useLoaderData({ from: Route.id })

  console.log('MEMBERS >>>', members)

  return <div>All members view coming soon.</div>
}
