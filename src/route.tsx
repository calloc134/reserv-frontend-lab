import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from "@tanstack/react-router";
import { LoginPage } from "./pages/LoginPage";
import { WeeklyMyReservations } from "./pages/WeeklyMyReservations";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { WeeklyReservations } from "./pages/WeeklyReservations";
import { AdminPanel } from "./pages/AdminPanel";
import { LoadingFallback } from "./components/LoadingFallback";
import { validateDateString } from "./utils/validateDateString";
import { AuthenticateLayoutPage } from "./pages/AuthenticateLayoutPage";
import { NotFound } from "./components/NotFound";

const rootRoute = createRootRoute({
  component: () => (
    <div>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </div>
  ),
});

const index_route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <LoginPage />,
});

const not_found_route = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  component: () => <NotFound />,
});

const home_route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/home",
  component: () => (
    <AuthenticateLayoutPage>
      <Outlet />
    </AuthenticateLayoutPage>
  ),
});

const reservations_route = createRoute({
  getParentRoute: () => home_route,
  path: "/",
  component: () => <WeeklyReservations />,
  pendingComponent: () => <LoadingFallback />,
  validateSearch: validateDateString,
});

const my_reservations_route = createRoute({
  getParentRoute: () => home_route,
  path: "/my_reservations",
  component: () => <WeeklyMyReservations />,
  validateSearch: validateDateString,
});

const admin_route = createRoute({
  getParentRoute: () => home_route,
  path: "/admin-this-is-a-secret",
  component: () => <AdminPanel />,
  validateSearch: validateDateString,
});

const routeTree = rootRoute.addChildren([
  index_route,
  home_route.addChildren([
    reservations_route,
    my_reservations_route,
    admin_route,
  ]),
  not_found_route,
]);

export const router = createRouter({
  routeTree,
  basepath: import.meta.env.VITE_APP_PATH || "/",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
