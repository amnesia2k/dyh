import { Card, CardHeader } from './ui/card'
import type { StatCardProps } from '@/utils/types'
import { cn } from '@/lib/utils'

export function StatCard({
  icon: Icon,
  label,
  value,
  subtext = '—',
  badgeClass,
}: StatCardProps) {
  return (
    <Card className="rounded-2xl border-border/60 bg-card/90 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <div className="text-4xl font-semibold tabular-nums">{value}</div>
          </div>
          <p className="text-xs text-muted-foreground">{subtext}</p>
        </div>
        <div
          className={cn(
            'mt-1 flex h-11 w-11 items-center justify-center rounded-full',
            badgeClass,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
    </Card>
  )
}
