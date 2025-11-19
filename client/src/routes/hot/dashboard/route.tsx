import { useEffect } from 'react'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { AppSidebar } from '@/components/app-sidebar'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useAuthStore } from '@/hooks/auth-store'
import { useCurrentHotQuery } from '@/hooks/dal/hot'

export const Route = createFileRoute('/hot/dashboard')({
  // loader: () => {
  //   if (typeof window === 'undefined') {
  //     // On the server, do nothing and let the client rerun the loader.
  //     return {}
  //   }

  //   const { isAuthenticated } = useAuthStore.getState()

  //   if (!isAuthenticated) {
  //     throw redirect({
  //       to: '/hot/login',
  //     })
  //   }

  //   return {}
  // },

  beforeLoad: () => {
    const token =
      typeof window !== 'undefined'
        ? window.localStorage.getItem('dyh_access_token')
        : null

    if (!token) {
      throw redirect({
        to: '/hot/login',
      })
    }
  },

  component: RouteComponent,
})

function RouteComponent() {
  const setHot = useAuthStore((state) => state.setHot)
  const { data: currentHot } = useCurrentHotQuery()

  useEffect(() => {
    if (currentHot) {
      setHot(currentHot)
    }
  }, [currentHot, setHot])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-5">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-5 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
