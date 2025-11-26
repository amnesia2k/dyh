import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import type { FormHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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

const tribeOptions = [
  { name: 'Agape Tribe', value: 'agape-tribe' },
  { name: 'Area 116', value: 'area-116' },
  { name: 'Blaze Tribe', value: 'blaze-tribe' },
  { name: 'Fountain Tribe', value: 'fountain-tribe' },
  { name: 'Impact Tribe', value: 'impact-tribe' },
  { name: 'Lighthouse Tribe', value: 'lighthouse-tribe' },
  { name: 'Love Marshall', value: 'love-marshall' },
  { name: 'Oasis Tribe', value: 'oasis-tribe' },
  { name: 'Ronel Tribe', value: 'ronel-tribe' },
]

export type SignupFormProps = FormHTMLAttributes<HTMLFormElement> & {
  isSubmitting?: boolean
  isUploading?: boolean
  onImageChange?: (file: File | null) => void
  imageUrl?: string
}

export function SignupForm({
  className,
  isSubmitting = false,
  isUploading = false,
  onImageChange,
  imageUrl,
  ...formProps
}: SignupFormProps) {
  const isDisabled = isSubmitting || isUploading
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedTribe, setSelectedTribe] = useState('')

  return (
    <form className={cn('flex flex-col gap-6', className)} {...formProps}>
      <FieldGroup>
        <input type="hidden" name="tribe" value={selectedTribe} />
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              disabled={isDisabled}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              disabled={isDisabled}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="tribe">Tribe</FieldLabel>
            <Select
              name="tribe"
              required
              disabled={isDisabled}
              value={selectedTribe}
              onValueChange={setSelectedTribe}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select tribe" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {tribeOptions.map((tribe) => (
                  <SelectItem key={tribe.value} value={tribe.value}>
                    {tribe.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+234..."
              disabled={isDisabled}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                disabled={isDisabled}
                required
              />
              <button
                type="button"
                aria-pressed={showPassword}
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={isDisabled}
                className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-2 flex items-center disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
                <span className="sr-only">
                  {showPassword ? 'Hide password' : 'Show password'}
                </span>
              </button>
            </div>
            <FieldDescription>
              Must be at least 8 characters long.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
            <div className="relative">
              <Input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                disabled={isDisabled}
                required
              />
              <button
                type="button"
                aria-pressed={showConfirmPassword}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                disabled={isDisabled}
                className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-2 flex items-center disabled:opacity-50"
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
                <span className="sr-only">
                  {showConfirmPassword ? 'Hide password' : 'Show password'}
                </span>
              </button>
            </div>
            <FieldDescription>Please confirm your password.</FieldDescription>
          </Field>

          <Field className="lg:col-span-2">
            <FieldLabel htmlFor="bio">Bio</FieldLabel>
            <Input
              id="bio"
              name="bio"
              type="text"
              placeholder="Tell us about yourself"
              disabled={isDisabled}
            />
          </Field>

          <Field className="lg:col-span-2">
            <FieldLabel htmlFor="image">Profile Image</FieldLabel>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              required
              disabled={isDisabled}
              onChange={(event) =>
                onImageChange?.(event.target.files?.[0] ?? null)
              }
            />

            {imageUrl ? (
              <p className="text-xs text-muted-foreground">
                Uploaded image ready.
              </p>
            ) : (
              <FieldDescription>
                Upload a clear headshot. Please wait for the upload to finish
                before submitting.
              </FieldDescription>
            )}
          </Field>

          <Field className="lg:col-span-2">
            <Button type="submit" disabled={isSubmitting || isUploading}>
              {isUploading
                ? 'Uploading image...'
                : isSubmitting
                  ? 'Creating account...'
                  : 'Create Account'}
            </Button>
          </Field>
        </div>

        <Field>
          <FieldDescription className="px-6 text-center">
            Already have an account?{' '}
            <Link to="/hot/login" search={{ redirect: '/hot/login' }}>
              Sign in
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
