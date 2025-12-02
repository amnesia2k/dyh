import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import {
  CalendarDays,
  HandHeart,
  History,
  Mic2,
  Sparkles,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import type { ActivityLog, Event } from '@/hooks/api/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { activitiesQueryOptions } from '@/hooks/dal/activities'
import { eventsQueryOptions } from '@/hooks/dal/events'
import { membersQueryOptions } from '@/hooks/dal/members'
import { prayerRequestsQueryOptions } from '@/hooks/dal/prayer-requests'
import { sermonsQueryOptions } from '@/hooks/dal/sermons'
import { testimoniesQueryOptions } from '@/hooks/dal/testimonies'

const ACTIVITY_LIMIT = 8
const EVENT_LIMIT = 5

export const Route = createFileRoute('/hot/dashboard/')({
  loader: async ({ context: { queryClient } }) => {
    const [activities, members, prayerRequests, testimonies, sermons, events] =
      await Promise.all([
        queryClient.ensureQueryData(
          activitiesQueryOptions({ staleTime: 2 * 60 * 1000 }),
        ),
        queryClient.ensureQueryData(membersQueryOptions()),
        queryClient.ensureQueryData(prayerRequestsQueryOptions()),
        queryClient.ensureQueryData(testimoniesQueryOptions()),
        queryClient.ensureQueryData(sermonsQueryOptions()),
        queryClient.ensureQueryData(eventsQueryOptions()),
      ])

    return {
      activities,
      metrics: {
        members: members.count,
        prayerRequests:
          prayerRequests.count ?? prayerRequests.prayerRequests.length,
        testimonies: testimonies.count ?? testimonies.testimonies.length,
        sermons: sermons.count ?? sermons.sermons.length,
      },
      upcomingEvents: events.events.slice(0, EVENT_LIMIT),
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { activities, metrics, upcomingEvents } = useLoaderData({
    from: Route.id,
  })

  return (
    <div className="space-y-6 bg-linear-to-br from-muted/40 via-background to-background p-1">
      <header className="space-y-1 px-1">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome to the DYH Admin Panel
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total members"
          value={metrics.members}
          badgeClass="bg-primary/10 text-primary"
          subtext="Latest synced total"
        />
        <StatCard
          icon={HandHeart}
          label="Prayer requests"
          value={metrics.prayerRequests}
          badgeClass="bg-secondary/10 text-secondary"
          subtext="Awaiting review"
        />
        <StatCard
          icon={Sparkles}
          label="Testimonies"
          value={metrics.testimonies}
          badgeClass="bg-accent/15 text-accent-foreground"
          subtext="Community highlights"
        />
        <StatCard
          icon={Mic2}
          label="Sermons"
          value={metrics.sermons}
          badgeClass="bg-muted text-foreground"
          subtext="Library updated"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/70 bg-card/90 shadow-[0_10px_40px_rgba(0,0,0,0.05)] lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Recent Activity</CardTitle>
            <CardDescription>Latest updates from the community</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.length ? (
              activities
                .slice(0, ACTIVITY_LIMIT)
                .map((activity, index) => (
                  <ActivityItem
                    key={activity._id ?? `${activity.action}-${index}`}
                    activity={activity}
                  />
                ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No activity logged yet.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/70 bg-card/90 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Upcoming Events</CardTitle>
            <CardDescription>
              Events scheduled for the coming weeks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.length ? (
              upcomingEvents.map((event) => (
                <EventItem key={event._id} event={event} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No events scheduled yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

type StatCardProps = {
  icon: LucideIcon
  label: string
  value: number
  subtext?: string
  badgeClass: string
}

function StatCard({
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

function ActivityItem({ activity }: { activity: ActivityLog }) {
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

function EventItem({ event }: { event: Event }) {
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

function formatAction(action: string) {
  return action
    .toLowerCase()
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function formatRelativeTime(dateString?: string) {
  if (!dateString) return '—'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return '—'

  const diff = Date.now() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`

  return formatFullDate(date)
}

function formatFullDate(date: Date | null) {
  if (!date || Number.isNaN(date.getTime())) return 'TBD'
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function formatEventDateTime(date: Date | null) {
  if (!date || Number.isNaN(date.getTime())) return 'Date to be announced'

  const datePart = formatFullDate(date)
  const timePart = new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)

  return `${datePart} at ${timePart}`
}
