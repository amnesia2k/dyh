import { useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export type FormInputProps = ComponentProps<typeof Input> & {
  label: ReactNode
  description?: ReactNode
  descriptionClassName?: string
  labelAccessory?: ReactNode
  fieldProps?: ComponentProps<typeof Field>
  inputWrapperClassName?: string
  enablePasswordToggle?: boolean
}

export function FormInput({
  label,
  description,
  descriptionClassName,
  labelAccessory,
  fieldProps,
  inputWrapperClassName,
  enablePasswordToggle = false,
  className,
  id,
  type = 'text',
  name,
  ...inputProps
}: FormInputProps) {
  const generatedId = useId()
  const inputId = id ?? name ?? generatedId
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const shouldTogglePassword = enablePasswordToggle && type === 'password'
  const inputType = shouldTogglePassword && isPasswordVisible ? 'text' : type

  return (
    <Field {...fieldProps}>
      <div className={labelAccessory ? 'flex items-center' : undefined}>
        <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
        {labelAccessory ? (
          <div className="ml-auto text-sm leading-snug">{labelAccessory}</div>
        ) : null}
      </div>

      <div
        className={cn(
          shouldTogglePassword ? 'relative' : undefined,
          inputWrapperClassName,
        )}
      >
        <Input
          id={inputId}
          name={name}
          type={inputType}
          className={className}
          {...inputProps}
        />

        {shouldTogglePassword ? (
          <button
            type="button"
            aria-pressed={isPasswordVisible}
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            disabled={inputProps.disabled}
            className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-2 flex items-center disabled:opacity-50"
          >
            {isPasswordVisible ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
            <span className="sr-only">
              {isPasswordVisible ? 'Hide password' : 'Show password'}
            </span>
          </button>
        ) : null}
      </div>

      {description ? (
        <FieldDescription className={descriptionClassName}>
          {description}
        </FieldDescription>
      ) : null}
    </Field>
  )
}
