import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import type { HotUser } from '@/hooks/auth-store'
import type { UpdateHotPayload } from '@/hooks/dal/hot'
import { HotCard } from '@/components/hot-card'
import { HotDetailsModal } from '@/components/hot-details-modal'
import { EmptyState } from '@/components/empty-state'
import { Input } from '@/components/ui/input'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useAuthStore } from '@/hooks/auth-store'
import {
  hotsQueryOptions,
  useDeleteHotMutation,
  useUpdateHotMutation,
} from '@/hooks/dal/hot'

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
  const hots = useLoaderData({ from: Route.id })
  const navigate = Route.useNavigate()
  const searchState = Route.useSearch()
  const [searchInput, setSearchInput] = useState(searchState.search ?? '')
  const [selectedHot, setSelectedHot] = useState<HotUser | null>(null)
  const currentUser = useAuthStore((state) => state.user)
  const canManage = currentUser?.role === 'admin'

  const { mutateAsync: updateHotMutation, isPending: isUpdating } =
    useUpdateHotMutation()
  const { mutateAsync: deleteHotMutation, isPending: isDeleting } =
    useDeleteHotMutation()
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

  const handleUpdateHot = async (id: string, payload: UpdateHotPayload) => {
    const toastId = toast.loading('Updating HOT...')
    try {
      const updated = await updateHotMutation({ id, payload })
      toast.success('HOT updated', { id: toastId })
      setSelectedHot((previous) =>
        previous && previous._id === updated._id ? updated : previous,
      )
      return updated
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to update HOT'
      toast.error(message, { id: toastId })
      return
    }
  }

  const handleDeleteHot = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this HOT head?',
    )
    if (!confirmed) return

    const toastId = toast.loading('Deleting HOT...')
    try {
      await deleteHotMutation(id)
      toast.success('HOT deleted', { id: toastId })
      setSelectedHot(null)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to delete HOT'
      toast.error(message, { id: toastId })
      return
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">HOT Management</h1>
          <p className="text-sm text-muted-foreground">Manage Head of Tribes</p>
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {hots.length ? (
          hots.map((user: HotUser) => (
            <HotCard key={user._id} hot={user} onView={setSelectedHot} />
          ))
        ) : (
          <EmptyState message="No HOT users match this search yet." />
        )}
      </div>

      {selectedHot ? (
        <HotDetailsModal
          open
          hot={selectedHot}
          canManage={!!canManage}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
          onClose={() => setSelectedHot(null)}
          onUpdate={handleUpdateHot}
          onDelete={handleDeleteHot}
        />
      ) : null}
    </div>
  )
}
