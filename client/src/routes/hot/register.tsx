import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { GalleryVerticalEnd } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { SignupForm } from '@/components/signup-form'
import { useAuthHydration, useAuthStore } from '@/hooks/auth-store'
import { useRegisterMutation } from '@/hooks/dal/auth'
import { useUploadImageMutation } from '@/hooks/dal/upload'

export const Route = createFileRoute('/hot/register')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const token = useAuthStore((state) => state.token)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const hydrated = useAuthHydration()
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { mutateAsync: registerMutation } = useRegisterMutation()

  const { mutateAsync: uploadImage, isPending: isUploading } =
    useUploadImageMutation()

  useEffect(() => {
    if (!hydrated || !isAuthenticated || !token) return

    navigate({ to: '/hot/dashboard', replace: true })
  }, [hydrated, isAuthenticated, navigate, token])

  const handleImageChange = async (file: File | null) => {
    if (!file) {
      setImageUrl(undefined)
      return
    }

    try {
      const result = await uploadImage(file)
      setImageUrl(result.imageUrl)
      toast.success('Image uploaded successfully')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to upload image'
      toast.error(message)
      setImageUrl(undefined)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return

    const formData = new FormData(event.currentTarget)
    const name = (formData.get('name') || '').toString().trim()
    const email = (formData.get('email') || '').toString().trim()
    const password = (formData.get('password') || '').toString()
    const confirmPassword = (formData.get('confirm-password') || '')
      .toString()
      .trim()
    const tribe = (formData.get('tribe') || '').toString().trim()
    const phone = (formData.get('phone') || '').toString().trim()
    const bioValue = (formData.get('bio') || '').toString().trim()

    if (isUploading) {
      toast.error('Please wait for the image upload to finish')
      return
    }

    if (!imageUrl) {
      toast.error('Please upload your profile image')
      return
    }

    if (!name || !email || !password || !tribe || !phone) {
      toast.error('Name, email, password, tribe, phone and image are required')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    const toastId = toast.loading('Creating account...')
    setIsSubmitting(true)

    try {
      const data = await registerMutation({
        name,
        email,
        password,
        tribe,
        phone,
        bio: bioValue || undefined,
        imageUrl,
      })

      const { token: authToken, ...user } = data
      setAuth({ token: authToken, user })
      navigate({ to: '/hot/dashboard', replace: true })
      toast.success('Account created')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to create account'
      toast.error(message)
    } finally {
      toast.dismiss(toastId)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm sm:max-w-md lg:max-w-2xl flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
        <SignupForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isUploading={isUploading}
          onImageChange={handleImageChange}
          imageUrl={imageUrl}
        />
      </div>
    </div>
  )
}
