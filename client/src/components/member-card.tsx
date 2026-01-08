import type { Member } from '@/hooks/api/types'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { formatTribeName, getInitials } from '@/utils/helpers'

export function MemberCard({
  member,
  onSelect,
}: {
  member: Member
  onSelect: (member: Member) => void
}) {
  const initials = getInitials(member.fullName)
  const tribeLabel = formatTribeName(member.departmentOfInterest)

  return (
    <Card
      onClick={() => onSelect(member)}
      className="border-border/70 bg-card/90 shadow-[0_10px_35px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(0,0,0,0.07)] cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(member)
        }
      }}
    >
      <CardContent className="flex items-center gap-4 p-4 sm:p-5">
        <Avatar className="size-12 bg-amber-50 text-amber-700 ring-4 ring-amber-100 shadow-sm">
          <AvatarFallback className="bg-transparent text-base font-semibold uppercase">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col gap-2">
          <p className="text-lg font-semibold leading-tight text-foreground">
            {member.fullName || 'Unnamed member'}
          </p>
          <span className="text-sm text-muted-foreground">
            {tribeLabel || 'No tribe set'}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
