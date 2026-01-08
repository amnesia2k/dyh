import type { HotUser } from '@/hooks/auth-store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatTribeName, getInitials } from '@/utils/helpers'

type HotCardProps = {
  hot: HotUser
  onView: (hot: HotUser) => void
}

export function HotCard({ hot, onView }: HotCardProps) {
  const initials = getInitials(hot.name)
  const tribeLabel = formatTribeName(hot.tribe)

  return (
    <Card className="overflow-hidden border-border/70 bg-card/90 shadow-[0_10px_35px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(0,0,0,0.07)] mx-auto max-w-[320px] py-0! gap-0!">
      <div className="aspect-square w-full max-w-[240px] max-h-[240px] overflow-hidden bg-muted mx-auto">
        {hot.imageUrl ? (
          <img
            src={hot.imageUrl}
            alt={hot.name || 'HOT head'}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-amber-50 via-white to-fuchsia-50 text-xl font-semibold text-amber-700">
            {initials}
          </div>
        )}
      </div>

      <CardContent className="flex flex-col gap-3 p-4">
        <div className="space-y-1">
          <p className="text-base font-semibold text-foreground">
            {hot.name || 'Unnamed HOT'}
          </p>
          <p className="text-sm text-muted-foreground">
            {tribeLabel || 'No tribe set'}
          </p>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={() => onView(hot)}>
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
