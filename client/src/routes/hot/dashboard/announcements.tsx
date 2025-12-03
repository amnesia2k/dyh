import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import type { Announcement } from '@/hooks/api/types'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { announcementsQueryOptions } from '@/hooks/dal/announcements'
import { formatFullDate } from '@/utils/helpers'

export const Route = createFileRoute('/hot/dashboard/announcements')({
  validateSearch: (search) => ({
    search:
      typeof search.search === 'string' && search.search.trim().length > 0
        ? search.search
        : undefined,
  }),
  loaderDeps: ({ search }) => ({ search: search.search ?? undefined }),
  loader: ({ context: { queryClient }, deps: { search } }) =>
    queryClient.ensureQueryData(
      announcementsQueryOptions(search ? { search } : undefined),
    ),
  component: RouteComponent,
})

function RouteComponent() {
  const { announcements, count } = useLoaderData({ from: Route.id })
  const navigate = Route.useNavigate()
  const searchState = Route.useSearch()
  const [searchInput, setSearchInput] = useState(searchState.search ?? '')
  const debouncedSearch = useDebouncedValue(searchInput, 350)

  useEffect(() => {
    setSearchInput(searchState.search ?? '')
  }, [searchState.search])

  useEffect(() => {
    const next = debouncedSearch.trim()
    navigate({
      replace: true,
      search: (prev) => {
        const current = typeof prev.search === 'string' ? prev.search : ''
        if (current === next) return prev
        return { ...prev, search: next || undefined }
      },
    })
  }, [debouncedSearch, navigate])

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Announcements</h1>
          <p className="text-sm text-muted-foreground">
            Live search across titles and summaries.
          </p>
        </div>
        <div className="flex w-full items-center gap-3 sm:max-w-sm">
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search announcements..."
            className="h-10"
          />
          {/* <span className="text-xs text-muted-foreground">{count} found</span> */}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {announcements.length ? (
          announcements.map((item: Announcement) => (
            <Card
              key={item._id}
              className="border-border/70 bg-card/80 shadow-[0_6px_24px_rgba(0,0,0,0.05)]"
            >
              <CardHeader className="pb-1">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  <CalendarDays className="mr-1 inline h-4 w-4 align-text-bottom" />
                  {formatFullDate(item.date ? new Date(item.date) : null)}
                </p>
              </CardHeader>
              {item.summary && (
                <CardContent className="pt-1 text-sm text-muted-foreground">
                  {item.summary}
                </CardContent>
              )}
            </Card>
          ))
        ) : (
          <EmptyState message="No announcements match this search yet." />
        )}
      </div>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border/80 bg-muted/40 p-6 text-center text-sm text-muted-foreground">
      {message}
    </div>
  )
}
