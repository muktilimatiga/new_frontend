import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  Outlet,
  redirect,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import CSMHeader from '../components/CSMHeader'
import { ThemeProvider } from '../hooks/use-theme'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { getToken } from '@/api/auth'

// This component will wrap all other routes
function RootDocument({ children }: { children: React.ReactNode }) {
  // We can get auth state from context now
  const {
    auth: { isAuthenticated },
  } = Route.useRouteContext()

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="csm-ui-theme">
          {/* Only render header if user is authenticated */}
          {isAuthenticated && <CSMHeader />}

          {/* Render the matched route component (e.g., Login or Dashboard) */}
          {children}

          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}

// This interface is for your router's context (e.g., auth)
interface MyRouterContext {
  queryClient: QueryClient
  auth: {
    isAuthenticated: boolean
  }
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'CSM Dashboard',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
  // We need to render <Outlet /> for children to appear
  component: Outlet,

  // --- CORRECTED AUTHENTICATION LOGIC ---

  // This function runs before any route loads
  beforeLoad: ({ location, context }) => {
    const isAuthenticated = !!getToken()
    console.debug('[auth] beforeLoad', { isAuthenticated, pathname: location.pathname })

    // If the user is not authenticated and not already on the login page,
    // redirect them to the login page.
    if (!isAuthenticated && location.pathname !== '/LoginPage') {
      throw redirect({
        to: '/LoginPage',
      })
    }

    // If the user IS authenticated and tries to go to /login,
    // send them to the dashboard instead.
    if (isAuthenticated && location.pathname === '/LoginPage') {
      throw redirect({
        to: '/dashboard',
      })
    }

    // Update context
    context.auth.isAuthenticated = isAuthenticated
  },
  // Removed invalid getContext option; router context is configured in getRouter()
  // This component renders when a route is not found
  notFoundComponent: () => {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">404 - Not Found</h1>
        <p>The page you were looking for does not exist.</p>
      </div>
    )
  },
})