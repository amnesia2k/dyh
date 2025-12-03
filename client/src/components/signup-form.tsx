import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'
import { FormInput } from '@/components/input'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
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
          <FormInput
            label="Full Name"
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            disabled={isDisabled}
            required
          />

          <FormInput
            label="Email"
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            disabled={isDisabled}
            required
          />

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

          <FormInput
            label="Phone Number"
            id="phone"
            name="phone"
            type="tel"
            placeholder="+234..."
            disabled={isDisabled}
            required
          />

          <FormInput
            label="Password"
            id="password"
            name="password"
            type="password"
            disabled={isDisabled}
            required
            enablePasswordToggle
            description="Must be at least 8 characters long."
          />

          <FormInput
            label="Confirm Password"
            id="confirm-password"
            name="confirm-password"
            type="password"
            disabled={isDisabled}
            required
            enablePasswordToggle
            description="Please confirm your password."
          />

          <FormInput
            label="Bio"
            id="bio"
            name="bio"
            type="text"
            placeholder="Tell us about yourself"
            disabled={isDisabled}
            fieldProps={{ className: 'lg:col-span-2' }}
          />

          <FormInput
            label="Profile Image"
            id="image"
            name="image"
            type="file"
            accept="image/*"
            required
            disabled={isDisabled}
            onChange={(event) =>
              onImageChange?.(event.target.files?.[0] ?? null)
            }
            description={
              imageUrl
                ? 'Uploaded image ready.'
                : 'Upload a clear headshot. Please wait for the upload to finish before submitting.'
            }
            descriptionClassName={imageUrl ? 'text-xs' : undefined}
            fieldProps={{ className: 'lg:col-span-2' }}
          />

          <Field className="lg:col-span-2">
            <Button type="submit" disabled={isSubmitting || isUploading}>
              {isSubmitting ? 'Creating account...' : 'Create Account'}
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
