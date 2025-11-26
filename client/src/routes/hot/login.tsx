import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { GalleryVerticalEnd } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { LoginForm } from '@/components/login-form'
import { useAuthHydration, useAuthStore } from '@/hooks/auth-store'
import { useLoginMutation } from '@/hooks/dal/auth'

export const Route = createFileRoute('/hot/login')({
  component: RouteComponent,
  validateSearch: (search) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
})

function RouteComponent() {
  const navigate = useNavigate()
  const search = Route.useSearch()
  const setAuth = useAuthStore((state) => state.setAuth)
  const token = useAuthStore((state) => state.token)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const hydrated = useAuthHydration()
  const [isLoading, setIsLoading] = useState(false)

  const { mutateAsync: loginMutation } = useLoginMutation()

  useEffect(() => {
    if (!hydrated || !isAuthenticated || !token) return

    navigate({
      to: search.redirect ?? '/hot/dashboard',
      replace: true,
    })
  }, [hydrated, isAuthenticated, navigate, search.redirect, token])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isLoading) return

    const formData = new FormData(event.currentTarget)
    const email = (formData.get('email') || '').toString()
    const password = (formData.get('password') || '').toString()

    if (!email || !password) {
      toast.error('Email and password are required')
      return
    }

    const toastId = toast.loading('Logging in...')
    setIsLoading(true)

    try {
      const data = await loginMutation({ email, password })
      const { token: authToken, ...user } = data
      setAuth({ token: authToken, user })
      navigate({
        to: search.redirect ?? '/hot/dashboard',
        replace: true,
      })
      toast.success('Logged in')
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to login. Please try again.'
      toast.error(message)
    } finally {
      toast.dismiss(toastId)
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
        <LoginForm onSubmit={handleSubmit} isSubmitting={isLoading} />
      </div>
    </div>
  )
}
