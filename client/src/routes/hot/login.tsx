import { useEffect } from 'react'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { GalleryVerticalEnd } from 'lucide-react'
import { toast } from 'sonner'
import { LoginForm } from '@/components/login-form'
import { useCurrentHotQuery } from '@/hooks/dal/hot'

export const Route = createFileRoute('/hot/login')({
  validateSearch: (search: Record<string, unknown>) => {
    const redirect =
      typeof search.redirect === 'string' ? search.redirect : undefined
    const reason = typeof search.reason === 'string' ? search.reason : undefined

    return { redirect, reason }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const search = useSearch({ from: '/hot/login' })
  const { data: currentHot } = useCurrentHotQuery()
  const navigate = useNavigate()

  useEffect(() => {
    if (search.reason === 'unauthorized') {
      toast.info('Login as HOT to access Dashboard')
    }
  }, [search])

  useEffect(() => {
    if (currentHot && currentHot.role === 'hot') {
      navigate({ to: '/hot/dashboard' })
    }
  }, [currentHot, navigate])

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
