import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
  useLoaderData,
  useRouterState,
} from '@tanstack/react-router'
import { useEffect } from 'react'
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
import { meQueryOptions } from '@/hooks/dal/auth'
import { useAuthStore } from '@/hooks/auth-store'

export const Route = createFileRoute('/hot/dashboard')({
  loader: async ({ context: { queryClient } }) => {
    if (!useAuthStore.persist.hasHydrated()) {
      await useAuthStore.persist.rehydrate()
    }

    try {
      return await queryClient.ensureQueryData(
        meQueryOptions({
          retry: false,
          staleTime: 5 * 60 * 1000,
          gcTime: 10 * 60 * 1000,
          refetchOnWindowFocus: false,
          throwOnError: false,
        }),
      )
    } catch (error) {
      useAuthStore.getState().clearAuth()
      throw redirect({
        to: '/hot/login',
        search: { redirect: '/hot/dashboard' },
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const user = useLoaderData({ from: Route.id })
  const setAuth = useAuthStore((state) => state.setAuth)
  const token = useAuthStore((state) => state.token)
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  useEffect(() => {
    if (token) {
      setAuth({ token, user })
    }
  }, [setAuth, token, user])

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
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-5">
          <div className="flex items-center gap-2">
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

          <div className="whitespace-nowrap">
            <Link to="/" className="text-sm underline">
              Go to website
            </Link>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-5 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
