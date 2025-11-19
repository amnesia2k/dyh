import { createFileRoute, redirect } from '@tanstack/react-router'
import { GalleryVerticalEnd } from 'lucide-react'

import { RegisterForm } from '@/components/register-form'
import { getAccessToken } from '@/hooks/api'

export const Route = createFileRoute('/hot/register')({
  beforeLoad: () => {
    const token = getAccessToken()

    if (token) {
      throw redirect({
        to: '/hot/dashboard',
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
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
