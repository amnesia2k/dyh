import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function NavMain({
  items,
}: {
  items: Array<{
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: Array<{
      title: string
      url: string
    }>
  }>
}) {
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Management</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild tooltip={item.title}>
              <Link
                to={item.url}
                onClick={() => {
                  if (isMobile) {
                    setOpenMobile(false)
                  }
                }}
              >
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
