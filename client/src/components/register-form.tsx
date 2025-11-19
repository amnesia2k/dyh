import { useRef, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ApiError } from '@/hooks/api'
import { HOT_TRIBES, useRegisterHotMutation } from '@/hooks/dal/hot'
import { useUploadImageMutation } from '@/hooks/dal/upload'

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const navigate = useNavigate()
  const { mutateAsync, isPending } = useRegisterHotMutation()
  const [showPassword, setShowPassword] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | undefined>(
    undefined,
  )
  const formRef = useRef<HTMLFormElement | null>(null)
  const { mutateAsync: uploadImageAsync } = useUploadImageMutation()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isUploadingImage) {
      toast.error('Please wait for the image upload to finish.')
      return
    }

    const formElement = event.currentTarget
    const formData = new FormData(formElement)

    const name = formData.get('name')?.toString().trim() ?? ''
    const email = formData.get('email')?.toString().trim() ?? ''
    const password = formData.get('password')?.toString() ?? ''
    const tribe = formData.get('tribe')?.toString().trim() ?? ''
    const phone = formData.get('phone')?.toString().trim() ?? ''
    const bio = formData.get('bio')?.toString().trim()
    const imageUrlFromForm = formData.get('imageUrl')?.toString().trim()
    const imageUrl = uploadedImageUrl || imageUrlFromForm || undefined

    const missingFields: Array<string> = []
    if (!name) missingFields.push('Full name')
    if (!email) missingFields.push('Email')
    if (!password) missingFields.push('Password')
    if (!tribe) missingFields.push('Tribe')
    if (!phone) missingFields.push('Phone')

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in the following required field(s): ${missingFields.join(', ')}`,
      )
      return
    }

    const promise = mutateAsync({
      name,
      email,
      password,
      tribe,
      phone,
      bio: bio || undefined,
      imageUrl,
    })

    toast.promise(promise, {
      loading: 'Creating account...',
      success: 'Registration successful',
      error: (error) =>
        error instanceof ApiError
          ? error.message
          : 'Failed to register. Please try again.',
    })

    try {
      await promise
      formElement.reset()
      navigate({ to: '/hot/dashboard' })
    } catch {
      // Error toast already handled by toast.promise
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>Register as a Head of Tribe</CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit} noValidate>
            <FieldGroup>
              <div className="grid gap-4 lg:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="name">Full name</FieldLabel>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Jane Doe"
                    required
                    disabled={isPending}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    disabled={isPending}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="‧‧‧‧‧‧‧‧"
                      minLength={8}
                      required
                      disabled={isPending}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </Field>
                <Field>
                  <FieldLabel htmlFor="phone">Phone</FieldLabel>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+234..."
                    required
                    disabled={isPending}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="tribe">Tribe</FieldLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={(value) => {
                      const hidden = formRef.current?.elements.namedItem(
                        'tribe',
                      ) as HTMLInputElement | null
                      if (hidden) hidden.value = value
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your tribe" />
                    </SelectTrigger>
                    <SelectContent>
                      {HOT_TRIBES.map((tribe) => (
                        <SelectItem key={tribe.value} value={tribe.value}>
                          {tribe.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input type="hidden" name="tribe" defaultValue="" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="bio">Bio (optional)</FieldLabel>
                  <Input
                    id="bio"
                    name="bio"
                    placeholder="Short bio"
                    disabled={isPending}
                  />
                </Field>
                <Field className="lg:col-span-2">
                  <FieldLabel htmlFor="imageUrl">
                    Profile image URL (optional)
                  </FieldLabel>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    disabled={isPending || isUploadingImage}
                    onChange={async (event) => {
                      const file = event.target.files?.[0]

                      if (!file) {
                        const hidden = formRef.current?.elements.namedItem(
                          'imageUrl',
                        ) as HTMLInputElement | null
                        if (hidden) hidden.value = ''
                        setUploadedImageUrl(undefined)
                        return
                      }

                      setIsUploadingImage(true)
                      try {
                        const promise = uploadImageAsync(file)

                        toast.promise(promise, {
                          loading: 'Uploading image...',
                          success: 'Image uploaded',
                          error: (error) =>
                            error instanceof ApiError
                              ? error.message
                              : 'Failed to upload image. Please try again.',
                        })

                        const result = await promise

                        console.log('Result >>>', result)
                        setUploadedImageUrl(result.imageUrl)

                        const hidden = formRef.current?.elements.namedItem(
                          'imageUrl',
                        ) as HTMLInputElement | null
                        if (hidden) hidden.value = result.imageUrl
                      } finally {
                        setIsUploadingImage(false)
                      }
                    }}
                  />
                  <input type="hidden" name="imageUrl" defaultValue="" />
                </Field>
              </div>
              <Field>
                <Button type="submit" disabled={isPending || isUploadingImage}>
                  {isPending ? 'Creating account...' : 'Create account'}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account?{' '}
                  <Link
                    to="/hot/login"
                    search={{ redirect: undefined, reason: undefined }}
                    className="underline-offset-4 hover:underline"
                  >
                    Login
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
