import { useEffect } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'

import { useAuthStore } from '@/hooks/auth-store'
import { useCurrentHotQuery } from '@/hooks/dal/hot'

export const Route = createFileRoute('/hot/dashboard/')({
  // loader: () => {
  //   if (typeof window === 'undefined') {
  //     // On the server, do nothing and let the client rerun the loader.
  //     return {}
  //   }

  //   const { isAuthenticated } = useAuthStore.getState()

  //   if (!isAuthenticated) {
  //     throw redirect({
  //       to: '/hot/login',
  //     })
  //   }

  //   return {}
  // },
  component: RouteComponent,
})

function RouteComponent() {
  // const setHot = useAuthStore((state) => state.setHot)
  // const { data: currentHot } = useCurrentHotQuery()

  // useEffect(() => {
  //   if (currentHot) {
  //     setHot(currentHot)
  //   }
  // }, [currentHot, setHot])

  return <div>Dashboard for HOT role</div>
}
