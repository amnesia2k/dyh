import * as React from 'react'
import {
  BookOpen,
  BookOpenText,
  Command,
  LayoutDashboard,
  Megaphone,
  MessageCircle,
  UserCog,
  Users,
} from 'lucide-react'

import type { HotUser } from '@/hooks/auth-store'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user?: HotUser
}

const navMainItems = [
  {
    title: 'Dashboard',
    url: '/hot/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'All Members',
    url: '/hot/dashboard/all-members',
    icon: Users,
  },
  {
    title: 'HOT Management',
    url: '/hot/dashboard/hot-management',
    icon: UserCog,
  },
  {
    title: 'Prayer Requests',
    url: '/hot/dashboard/prayer-requests',
    icon: MessageCircle,
  },
  {
    title: 'Testimonies',
    url: '/hot/dashboard/testimonies',
    icon: BookOpen,
  },
  {
    title: 'Sermon Manager',
    url: '/hot/dashboard/sermon-manager',
    icon: BookOpenText,
  },
  {
    title: 'Announcements',
    url: '/hot/dashboard/announcements',
    icon: Megaphone,
  },
]

export function AppSidebar({ user, ...rest }: AppSidebarProps) {
  return (
    <Sidebar variant="inset" {...rest}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
