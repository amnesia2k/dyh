import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useEffect } from 'react'
import { ensureInstagramPosts } from '@/hooks/dal/instagram'
import { InstagramEmbed } from '@/components/instagram-embed'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/(jg)/gallery')({
  loader: ({ context: { queryClient } }) => ensureInstagramPosts(queryClient),
  component: RouteComponent,
})

function RouteComponent() {
  const posts = useLoaderData({ from: Route.id })

  useEffect(() => {
    if ((window as any).instgrm?.Embeds?.process) {
      ;(window as any).instgrm.Embeds.process()
    }
  }, [posts])

  const hasPosts = posts.length > 0

  return (
    <div className="bg-linear-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300/90">
            Highlights
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-50">
                Instagram Gallery
              </h1>
              <p className="max-w-3xl text-base text-muted-foreground">
                A rolling feed of our favorite moments. Tap a card to view the
                full post on Instagram if embeds are blocked in your browser.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hasPosts ? (
            posts.map((post) => (
              <Card
                key={post._id}
                className="overflow-hidden border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/60"
              >
                <CardHeader className="pb-0">
                  <CardTitle className="text-lg">Featured Post</CardTitle>
                  <CardDescription className="text-xs">
                    Pulled directly from Instagram
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="relative mx-4 mb-4 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                    <InstagramEmbed html={post.embedHtml} url={post.url} />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full border-dashed bg-white/60 text-center backdrop-blur dark:bg-slate-900/50">
              <CardHeader>
                <CardTitle>No posts yet</CardTitle>
                <CardDescription>
                  When Instagram posts are added, they will appear here
                  automatically.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
