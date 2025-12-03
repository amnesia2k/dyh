import type { ActivityLog } from '@/hooks/api/types'
import { cn } from '@/lib/utils'
import { formatAction, formatRelativeTime } from '@/utils/helpers'

export function ActivityItem({ activity }: { activity: ActivityLog }) {
  const badgeClass = {
    NEW: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-100',
    UPDATED:
      'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-50',
    DELETED: 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-50',
  }[activity.type]

  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/70 px-3 py-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
      <div className="flex-1 space-y-1">
        <p className="font-medium leading-tight">
          {activity.message ?? formatAction(activity.action)}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatRelativeTime(activity.createdAt)}
        </p>
      </div>
      <div
        className={cn(
          'rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-tight',
          badgeClass,
        )}
      >
        {activity.type}
      </div>
    </div>
  )
}
