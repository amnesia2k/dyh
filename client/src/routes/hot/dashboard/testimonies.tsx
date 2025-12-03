import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import type { Testimony } from '@/hooks/api/types'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { testimoniesQueryOptions } from '@/hooks/dal/testimonies'

export const Route = createFileRoute('/hot/dashboard/testimonies')({
  validateSearch: (search) => ({
    search:
      typeof search.search === 'string' && search.search.trim().length > 0
        ? search.search
        : undefined,
  }),
  loaderDeps: ({ search }) => ({ search: search.search ?? undefined }),
  loader: ({ context: { queryClient }, deps: { search } }) =>
    queryClient.ensureQueryData(
      testimoniesQueryOptions(search ? { search } : undefined),
    ),
  component: RouteComponent,
})

function RouteComponent() {
  const { testimonies, count } = useLoaderData({ from: Route.id })
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
          <h1 className="text-2xl font-semibold">Testimonies</h1>
          <p className="text-sm text-muted-foreground">
            Search testimonies by name, email or message.
          </p>
        </div>
        <div className="flex w-full items-center gap-3 sm:max-w-sm">
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search testimonies..."
            className="h-10"
          />
          {/* <span className="text-xs text-muted-foreground">{count} found</span> */}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {testimonies.length ? (
          testimonies.map((item: Testimony) => (
            <Card
              key={item._id}
              className="border-border/70 bg-card/80 shadow-[0_6px_24px_rgba(0,0,0,0.05)]"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {item.anonymous ? 'Anonymous' : item.fullName || 'Anonymous'}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {item.email || 'No email'} • {item.status}
                </p>
              </CardHeader>
              <CardContent className="flex items-start gap-2 pt-1 text-sm text-muted-foreground">
                <Sparkles className="mt-1 h-4 w-4 text-foreground/70" />
                <p className="line-clamp-3 leading-relaxed">{item.message}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyState message="No testimonies match this search yet." />
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
