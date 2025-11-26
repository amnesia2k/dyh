import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'
import { Fragment } from 'react/jsx-runtime'
import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

export const Route = createFileRoute('/hot/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const segments = pathname.split('/').filter(Boolean)
  const dashboardIndex = segments.findIndex(
    (segment) => segment === 'dashboard',
  )
  const afterDashboard =
    dashboardIndex >= 0 ? segments.slice(dashboardIndex + 1) : []

  const breadcrumbs = [
    { label: 'Dashboard', href: '/hot/dashboard' },
    ...afterDashboard.map((segment, index) => {
      const label = segment
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')

      const href = `/hot/dashboard/${afterDashboard
        .slice(0, index + 1)
        .join('/')}`

      return { label, href }
    }),
  ]

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
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1
                  const isFirst = index === 0

                  return (
                    <Fragment key={crumb.href}>
                      <BreadcrumbItem
                        className={
                          isFirst && !isLast ? 'hidden md:block' : undefined
                        }
                      >
                        {isLast ? (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={crumb.href}>
                            {crumb.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && (
                        <BreadcrumbSeparator
                          className={isFirst ? 'hidden md:block' : undefined}
                        />
                      )}
                    </Fragment>
                  )
                })}
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
