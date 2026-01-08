import {
  CalendarIcon,
  Clock3Icon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  SparkleIcon,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Avatar, AvatarFallback } from './ui/avatar'
import type { Member } from '@/hooks/api/types'
import { formatDateLabel, formatTribeName, getInitials } from '@/utils/helpers'

export function MemberDetailsModal({
  member,
  onClose,
}: {
  member: Member
  onClose: () => void
}) {
  const initials = getInitials(member.fullName)
  const tribeLabel = formatTribeName(member.departmentOfInterest)
  const birthdayLabel =
    formatDateLabel(member.birthday, { month: 'long', day: 'numeric' }) ??
    'No birthday provided'
  const memberSince =
    formatDateLabel(member.joinedAt ?? member.createdAt, {
      month: 'short',
      year: 'numeric',
    }) ?? 'Member since date unavailable'

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg rounded-2xl border-0 shadow-2xl ring-1 ring-border/70">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-xl">Member Details</DialogTitle>
          <DialogDescription className="text-sm">
            View complete member information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 border-t border-border/70 pt-5">
          <div className="flex items-center gap-4">
            <Avatar className="size-14 bg-amber-50 text-amber-700 ring-4 ring-amber-100 shadow-sm">
              <AvatarFallback className="bg-transparent text-lg font-semibold uppercase">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <p className="text-lg font-semibold text-foreground">
                {member.fullName || 'Unnamed member'}
              </p>
              {tribeLabel && (
                <p className="text-sm text-muted-foreground">{tribeLabel}</p>
              )}
            </div>
          </div>

          <div className="space-y-3 text-sm text-foreground">
            {tribeLabel && (
              <div className="flex items-start gap-3">
                <SparkleIcon className="mt-0.5 size-4 text-orange-500" />
                <span>{tribeLabel}</span>
              </div>
            )}
            {member.email && (
              <div className="flex items-start gap-3">
                <MailIcon className="mt-0.5 size-4 text-orange-500" />
                <span>{member.email}</span>
              </div>
            )}
            {member.phone && (
              <div className="flex items-start gap-3">
                <PhoneIcon className="mt-0.5 size-4 text-orange-500" />
                <span>{member.phone}</span>
              </div>
            )}
            {member.birthday && (
              <div className="flex items-start gap-3">
                <CalendarIcon className="mt-0.5 size-4 text-orange-500" />
                <span>Birthday: {birthdayLabel}</span>
              </div>
            )}
            {member.address && (
              <div className="flex items-start gap-3">
                <MapPinIcon className="mt-0.5 size-4 text-orange-500" />
                <span>{member.address}</span>
              </div>
            )}
            {(member.joinedAt || member.createdAt) && (
              <div className="flex items-start gap-3">
                <Clock3Icon className="mt-0.5 size-4 text-orange-500" />
                <span>Member since {memberSince}</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
