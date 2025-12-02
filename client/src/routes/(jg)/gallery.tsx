import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useEffect } from 'react'
import { ensureInstagramPosts } from '@/hooks/dal/instagram'
import { InstagramEmbed } from '@/components/instagram-embed'

export const Route = createFileRoute('/(jg)/gallery')({
  loader: ({ context: { queryClient } }) => ensureInstagramPosts(queryClient),
  component: RouteComponent,
})

function RouteComponent() {
  const posts = useLoaderData({ from: Route.id })

  console.log('POSTS >>>', posts)

  useEffect(() => {
    if ((window as any).instgrm?.Embeds?.process) {
      ;(window as any).instgrm.Embeds.process()
    }
  }, [posts])

  return (
    <div className="py-10">
      <h1 className="text-3xl font-semibold mb-6">Gallery</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <InstagramEmbed key={post._id} html={post.embedHtml} url={post.url} />
        ))}
      </div>
    </div>
  )
}
