import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { validateDateString } from "./utils/date/validateDateString";
import { LoginPage } from "./pages/LoginPage";
import { AuthenticateLayoutPage } from "./pages/AuthenticateLayoutPage";

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
}).lazy(() => import("./routes/NotFoundRoute").then((m) => m.NotFoundRoute));

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
  validateSearch: validateDateString,
}).lazy(() =>
  import("./routes/ReservationsRoute").then((m) => m.ReservationsRoute)
);

const my_reservations_route = createRoute({
  getParentRoute: () => home_route,
  path: "/my_reservations",
  validateSearch: validateDateString,
}).lazy(() =>
  import("./routes/MyReservationsRoute").then((m) => m.MyReservationsRoute)
);

const admin_route = createRoute({
  getParentRoute: () => home_route,
  path: "/admin-this-is-a-secret",
  validateSearch: validateDateString,
}).lazy(() => import("./routes/AdminRoute").then((m) => m.AdminRoute));

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
