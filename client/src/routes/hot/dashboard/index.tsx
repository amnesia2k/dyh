import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { HandHeart, Mic2, Sparkles, Users } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { activitiesQueryOptions } from '@/hooks/dal/activities'
import { eventsQueryOptions } from '@/hooks/dal/events'
import { membersQueryOptions } from '@/hooks/dal/members'
import { prayerRequestsQueryOptions } from '@/hooks/dal/prayer-requests'
import { sermonsQueryOptions } from '@/hooks/dal/sermons'
import { testimoniesQueryOptions } from '@/hooks/dal/testimonies'
import { EventItem } from '@/components/event-item'
import { StatCard } from '@/components/stat-card'
import { ActivityItem } from '@/components/activity-item'

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
        prayerRequests: prayerRequests.count,
        testimonies: testimonies.count,
        sermons: sermons.count,
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
                .map((activity, idx) => (
                  <ActivityItem key={activity._id || idx} activity={activity} />
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
