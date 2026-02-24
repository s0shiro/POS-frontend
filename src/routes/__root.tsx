import {
  createRootRouteWithContext,
  Outlet,
  Link,
  useRouterState,
} from "@tanstack/react-router";
import { AppLayout } from "@/components/layout";
import type { RouterContext } from "@/router";
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'

function RootErrorComponent({ error }: { error: Error }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">
          Something went wrong
        </h1>
        <p className="mt-2 text-gray-600">{error.message}</p>
        <Link
          to="/login"
          className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}

// Routes that should NOT have the layout (full-screen pages)
const noLayoutRoutes = ["/login", "/display", "/kds", "/unauthorized"];

function RootComponent() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // Check if current route should skip the layout
  const shouldSkipLayout = noLayoutRoutes.some(
    (route) => currentPath === route || currentPath.startsWith(route + "/"),
  );

  if (shouldSkipLayout) {
    return <Outlet />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  errorComponent: RootErrorComponent,
});
