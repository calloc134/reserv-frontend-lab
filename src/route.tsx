import {
  createRouter,
  createRoute,
  createRootRoute,
  useNavigate,
  Outlet,
} from "@tanstack/react-router";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { LoginPage } from "./pages/LoginPage";
import { MyReservations } from "./pages/MyReservations";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { HomeLayout } from "./components/HomeLayout";

const rootRoute = createRootRoute({
  component: () => (
    <div>
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  ),
});

const index_route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <LoginPage />,
});

const home_route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/home",
  component: () => {
    const { isSignedIn } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
      if (!isSignedIn) {
        console.error("User is not signed in");
        navigate({
          to: "/",
        });
      }
    }, [isSignedIn, navigate]);

    return (
      <HomeLayout>
        <Outlet />
      </HomeLayout>
    );
  },
});

const my_reservations_route = createRoute({
  getParentRoute: () => home_route,
  path: "/",
  component: () => <MyReservations />,
});

const routeTree = rootRoute.addChildren([
  index_route,
  home_route.addChildren([my_reservations_route]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
