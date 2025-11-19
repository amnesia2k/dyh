import { useEffect } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'

import { getAccessToken } from '@/hooks/api'
import { useAuthStore } from '@/hooks/auth-store'
import { useCurrentHotQuery } from '@/hooks/dal/hot'

export const Route = createFileRoute('/hot/dashboard/')({
  loader: () => {
    if (typeof window === 'undefined') {
      return {}
    }

    const token = getAccessToken()

    if (!token) {
      throw redirect({
        to: '/hot/login',
      })
    }

    return {}
  },
  component: RouteComponent,
})

function RouteComponent() {
  const setHot = useAuthStore((state) => state.setHot)
  const { data: currentHot } = useCurrentHotQuery()

  useEffect(() => {
    const token = getAccessToken()

    if (token && currentHot) {
      setHot(currentHot)
    }
  }, [currentHot, setHot])

  return <div>Dashboard for HOT role</div>
}
