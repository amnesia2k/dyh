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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
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
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
