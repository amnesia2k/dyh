import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { GalleryVerticalEnd } from 'lucide-react'

import { RegisterForm } from '@/components/register-form'
import { useCurrentHotQuery } from '@/hooks/dal/hot'

export const Route = createFileRoute('/hot/register')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: currentHot } = useCurrentHotQuery()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentHot && currentHot.role === 'hot') {
      navigate({ to: '/hot/dashboard' })
    }
  }, [currentHot, navigate])

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm sm:max-w-md lg:max-w-2xl flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
        <RegisterForm />
      </div>
    </div>
  )
}
