import { useEffect, useMemo, useState } from 'react'
import {
  CalendarIcon,
  MailIcon,
  PencilIcon,
  PhoneIcon,
  ShieldCheckIcon,
  SparkleIcon,
  Trash2Icon,
  XIcon,
} from 'lucide-react'
import type React from 'react'
import type { HotUser } from '@/hooks/auth-store'
import type { UpdateHotPayload } from '@/hooks/dal/hot'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { tribeOptions } from '@/data/tribe-options'
import { formatDateLabel, formatTribeName, getInitials } from '@/utils/helpers'

type HotDetailsModalProps = {
  hot: HotUser
  open: boolean
  canManage: boolean
  isUpdating?: boolean
  isDeleting?: boolean
  onClose: () => void
  onUpdate: (id: string, payload: UpdateHotPayload) => Promise<HotUser | void>
  onDelete: (id: string) => Promise<void>
}

export function HotDetailsModal({
  hot,
  open,
  canManage,
  isUpdating,
  isDeleting,
  onClose,
  onUpdate,
  onDelete,
}: HotDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formState, setFormState] = useState(() => mapHotToForm(hot))

  useEffect(() => {
    setFormState(mapHotToForm(hot))
    setIsEditing(false)
  }, [hot])

  const tribeLabel = useMemo(() => formatTribeName(hot.tribe), [hot.tribe])
  const initials = getInitials(hot.name)
  const joinedLabel =
    formatDateLabel(hot.createdAt, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) ?? 'Date unavailable'

  const handleSave = async () => {
    const payload: UpdateHotPayload = {
      name: formState.name || undefined,
      email: formState.email || undefined,
      tribe: formState.tribe || undefined,
      phone: formState.phone || undefined,
      bio: formState.bio || undefined,
    }

    try {
      const updated = await onUpdate(hot._id, payload)
      if (updated) {
        setFormState(mapHotToForm(updated))
      }
      setIsEditing(false)
    } catch {
      // errors are surfaced via toast in the caller
    }
  }

  const handleDelete = async () => {
    try {
      await onDelete(hot._id)
    } catch {
      // errors are surfaced via toast in the caller
    }
  }

  const displayTribe = isEditing
    ? formState.tribe
    : tribeLabel || 'No tribe set'

  const displayName = isEditing ? formState.name : hot.name || 'Unnamed HOT'

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-3xl gap-6 rounded-2xl border-0 shadow-2xl ring-1 ring-border/70">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-xl">HOT Details</DialogTitle>
          <DialogDescription className="text-sm">
            View and manage head of tribe information.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="overflow-hidden rounded-xl border border-border/70">
            {hot.imageUrl ? (
              <img
                src={hot.imageUrl}
                alt={hot.name || 'HOT head image'}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-[280px] items-center justify-center bg-linear-to-br from-amber-50 via-white to-fuchsia-50 text-2xl font-semibold text-amber-700">
                {initials}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="space-y-1">
              <p className="text-lg font-semibold text-foreground">
                {displayName}
              </p>
              <p className="text-sm text-muted-foreground">{displayTribe}</p>
            </div>

            <div className="space-y-3">
              <InfoRow
                icon={<SparkleIcon className="size-4 text-orange-500" />}
                label="Tribe"
                value={
                  isEditing ? (
                    <Select
                      value={formState.tribe}
                      onValueChange={(value) =>
                        setFormState((prev) => ({ ...prev, tribe: value }))
                      }
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
                  ) : (
                    tribeLabel || 'No tribe set'
                  )
                }
              />

              <InfoRow
                icon={<MailIcon className="size-4 text-orange-500" />}
                label="Email"
                value={
                  isEditing ? (
                    <Input
                      value={formState.email}
                      onChange={(event) =>
                        setFormState((prev) => ({
                          ...prev,
                          email: event.target.value,
                        }))
                      }
                      type="email"
                      placeholder="Email"
                    />
                  ) : (
                    hot.email || 'No email provided'
                  )
                }
              />

              <InfoRow
                icon={<PhoneIcon className="size-4 text-orange-500" />}
                label="Phone"
                value={
                  isEditing ? (
                    <Input
                      value={formState.phone}
                      onChange={(event) =>
                        setFormState((prev) => ({
                          ...prev,
                          phone: event.target.value,
                        }))
                      }
                      type="tel"
                      placeholder="Phone number"
                    />
                  ) : (
                    hot.phone || 'No phone number provided'
                  )
                }
              />

              <InfoRow
                icon={<ShieldCheckIcon className="size-4 text-orange-500" />}
                label="Role"
                value={hot.role}
              />

              <InfoRow
                icon={<CalendarIcon className="size-4 text-orange-500" />}
                label="Joined"
                value={joinedLabel}
              />

              <InfoRow
                icon={<XIcon className="size-4 text-orange-500 rotate-45" />}
                label="Bio"
                value={
                  isEditing ? (
                    <textarea
                      value={formState.bio}
                      onChange={(event) =>
                        setFormState((prev) => ({
                          ...prev,
                          bio: event.target.value,
                        }))
                      }
                      placeholder="Bio"
                      className="focus-visible:ring-ring/50 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition focus-visible:outline-none focus-visible:ring-2"
                      rows={3}
                    />
                  ) : (
                    hot.bio || 'No bio provided'
                  )
                }
              />
            </div>

            {canManage ? (
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                {!isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <PencilIcon className="mr-2 size-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      <Trash2Icon className="mr-2 size-4" />
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormState(mapHotToForm(hot))
                        setIsEditing(false)
                      }}
                      disabled={isUpdating}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Saving...' : 'Save changes'}
                    </Button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-1 inline-flex size-8 items-center justify-center rounded-full bg-amber-50 text-amber-700">
        {icon}
      </span>
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
          {label}
        </p>
        <div className="text-sm text-foreground">{value}</div>
      </div>
    </div>
  )
}

function mapHotToForm(hot: HotUser) {
  return {
    name: hot.name ?? '',
    email: hot.email,
    tribe: hot.tribe,
    phone: hot.phone ?? '',
    bio: hot.bio ?? '',
  }
}
