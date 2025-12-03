import { CalendarDays } from 'lucide-react'
import type { Event } from '@/hooks/api/types'
import { formatEventDateTime } from '@/utils/helpers'

export function EventItem({ event }: { event: Event }) {
  const date = event.date ? new Date(event.date) : null

  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/70 p-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/15 text-secondary">
        <CalendarDays className="h-5 w-5" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="font-semibold leading-tight text-foreground">
          {event.title}
        </p>
        <p className="text-sm text-muted-foreground">
          {formatEventDateTime(date)}
          {event.location ? ` • ${event.location}` : ''}
        </p>
      </div>
    </div>
  )
}
