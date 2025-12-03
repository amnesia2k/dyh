import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import type { HotUser } from '@/hooks/auth-store'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { hotsQueryOptions } from '@/hooks/dal/hot'

export const Route = createFileRoute('/hot/dashboard/hot-management')({
  ssr: true,
  validateSearch: (search) => ({
    search:
      typeof search.search === 'string' && search.search.trim().length > 0
        ? search.search
        : undefined,
  }),
  loaderDeps: ({ search }) => ({ search: search.search ?? undefined }),
  loader: ({ context: { queryClient }, deps: { search } }) =>
    queryClient.ensureQueryData(
      hotsQueryOptions(search ? { search } : undefined),
    ),
  component: RouteComponent,
})

function RouteComponent() {
  const hot = useLoaderData({ from: Route.id })
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
          <h1 className="text-2xl font-semibold">HOT Management</h1>
          <p className="text-sm text-muted-foreground">
            Search HOT users by name, email, tribe, phone or role.
          </p>
        </div>
        <div className="flex w-full items-center gap-3 sm:max-w-sm">
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search HOT users..."
            className="h-10"
          />
          {/* <span className="text-xs text-muted-foreground">
            {hot.length} found
          </span> */}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {hot.length ? (
          hot.map((user: HotUser) => (
            <Card
              key={user._id}
              className="border-border/70 bg-card/80 shadow-[0_6px_24px_rgba(0,0,0,0.05)]"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{user.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {user.email} • {user.tribe}
                </p>
              </CardHeader>
              <CardContent className="flex items-start gap-2 pt-1 text-sm text-muted-foreground">
                <ShieldCheck className="mt-1 h-4 w-4 text-foreground/70" />
                <div className="space-y-1">
                  <p>{user.role}</p>
                  {user.phone && <p>{user.phone}</p>}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyState message="No HOT users match this search yet." />
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
