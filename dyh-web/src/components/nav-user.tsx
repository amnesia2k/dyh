import { ChevronsUpDown, LogOut } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function NavUser() {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()

  // if (!hot) {
  //   return null
  // }

  // const name = hot.name ?? hot.email
  // const email = hot.email
  // const avatar = hot.imageUrl

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {/* {avatar ? (
                  <AvatarImage src={avatar} alt={name} />
                ) : (
                  <AvatarFallback className="rounded-lg">
                    {name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )} */}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                {/* <span className="truncate font-medium">{name}</span>
                <span className="truncate text-xs">{email}</span> */}
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {/* {avatar ? (
                    <AvatarImage src={avatar} alt={name} />
                  ) : (
                    <AvatarFallback className="rounded-lg">
                      {name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )} */}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  {/* <span className="truncate font-medium">{name}</span>
                  <span className="truncate text-xs">{email}</span> */}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
            // disabled={isPending}
            // onClick={async () => {
            //   const promise = logout()

            //   toast.promise(promise, {
            //     loading: 'Logging out...',
            //     success: 'Logged out',
            //     error: 'Failed to log out. Please try again.',
            //   })

            //   try {
            //     await promise
            //     navigate({ to: '/hot/login' })
            //   } catch {
            //     // toast already handled
            //   }
            // }}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
