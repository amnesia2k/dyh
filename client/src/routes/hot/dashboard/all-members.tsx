import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import type { Member } from '@/hooks/api/types'
import { MemberCard } from '@/components/member-card'
import { Input } from '@/components/ui/input'
import { membersQueryOptions } from '@/hooks/dal/members'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { MemberDetailsModal } from '@/components/member-details-modal'
import { EmptyState } from '@/components/empty-state'

export const Route = createFileRoute('/hot/dashboard/all-members')({
  validateSearch: (search) => ({
    search:
      typeof search.search === 'string' && search.search.trim().length > 0
        ? search.search
        : undefined,
  }),
  loaderDeps: ({ search }) => ({ search: search.search ?? undefined }),
  loader: ({ context: { queryClient }, deps: { search } }) =>
    queryClient.ensureQueryData(
      membersQueryOptions(search ? { search } : undefined),
    ),
  component: RouteComponent,
})

function RouteComponent() {
  const { members } = useLoaderData({ from: Route.id })
  const navigate = Route.useNavigate()
  const searchState = Route.useSearch()
  const [searchInput, setSearchInput] = useState(searchState.search ?? '')
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
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
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Members</h1>
          <p className="text-sm text-muted-foreground">Manage Church members</p>
        </div>
        <div className="flex w-full items-center gap-3 sm:max-w-sm">
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search members..."
            className="h-10"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {members.length ? (
          members.map((member: Member) => (
            <MemberCard
              key={member._id}
              member={member}
              onSelect={setSelectedMember}
            />
          ))
        ) : (
          <EmptyState message="No members match this search yet." />
        )}
      </div>

      {selectedMember ? (
        <MemberDetailsModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      ) : null}
    </div>
  )
}
