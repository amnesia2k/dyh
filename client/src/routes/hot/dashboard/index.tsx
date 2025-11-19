import { createFileRoute, redirect } from '@tanstack/react-router'
import type { Hot } from '@/hooks/dal/hot'
import { fetchCurrentHot, hotKeys } from '@/hooks/dal/hot'

export const Route = createFileRoute('/hot/dashboard/')({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient

    const user = await queryClient.ensureQueryData<Hot | null>({
      queryKey: hotKeys.current(),
      queryFn: fetchCurrentHot,
    })

    if (!user) {
      throw redirect({
        to: '/hot/login',
        search: { redirect: '/hot/dashboard', reason: 'unauthorized' },
      })
    }

    if (user.role !== 'hot') {
      throw redirect({ to: '/' })
    }

    return { user }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Dashboard for HOT role</div>
}
