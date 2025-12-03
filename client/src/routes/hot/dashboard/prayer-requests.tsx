import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { MessageSquareText } from 'lucide-react'
import type { PrayerRequest } from '@/hooks/api/types'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { prayerRequestsQueryOptions } from '@/hooks/dal/prayer-requests'

export const Route = createFileRoute('/hot/dashboard/prayer-requests')({
  validateSearch: (search) => ({
    search:
      typeof search.search === 'string' && search.search.trim().length > 0
        ? search.search
        : undefined,
  }),
  loaderDeps: ({ search }) => ({ search: search.search ?? undefined }),
  loader: ({ context: { queryClient }, deps: { search } }) =>
    queryClient.ensureQueryData(
      prayerRequestsQueryOptions(search ? { search } : undefined),
    ),
  component: RouteComponent,
})

function RouteComponent() {
  const { prayerRequests, count } = useLoaderData({ from: Route.id })
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
          <h1 className="text-2xl font-semibold">Prayer Requests</h1>
          <p className="text-sm text-muted-foreground">
            Search messages by name, email or content.
          </p>
        </div>
        <div className="flex w-full items-center gap-3 sm:max-w-sm">
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search prayer requests..."
            className="h-10"
          />
          {/* <span className="text-xs text-muted-foreground">{count} found</span> */}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {prayerRequests.length ? (
          prayerRequests.map((request: PrayerRequest) => (
            <Card
              key={request._id}
              className="border-border/70 bg-card/80 shadow-[0_6px_24px_rgba(0,0,0,0.05)]"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {request.fullName || 'Anonymous'}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {request.email || 'No email provided'} • {request.status}
                </p>
              </CardHeader>
              <CardContent className="flex items-start gap-2 pt-1 text-sm text-muted-foreground">
                <MessageSquareText className="mt-1 h-4 w-4 text-foreground/70" />
                <p className="line-clamp-3 leading-relaxed">
                  {request.message}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyState message="No prayer requests match this search yet." />
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
