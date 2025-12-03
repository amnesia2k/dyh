import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { ensureInstagramPosts } from '@/hooks/dal/instagram'

export const Route = createFileRoute('/hot/dashboard/gallery')({
  loader: ({ context: { queryClient } }) => ensureInstagramPosts(queryClient),
  component: RouteComponent,
})

function RouteComponent() {
  const posts = useLoaderData({ from: Route.id })

  console.log('POSTS >>>', posts)

  return <div>Hello "/hot/dashboard/gallery"!</div>
}
