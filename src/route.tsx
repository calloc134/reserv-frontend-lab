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
import { WeeklyMyReservations } from "./pages/WeeklyMyReservations";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { HomeLayout } from "./components/HomeLayout";
import { Suspense } from "react";
import toast from "react-hot-toast";
import { WeeklyReservations } from "./pages/WeeklyReservations";
import { AdminPanel } from "./pages/AdminPanel";
import { LoadingFallback } from "./components/LoadingFallback";
import { getMondayOfThisWeek } from "./utils/getMondayOfThisWeek";

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
  component: () => (
    <div className="flex h-screen justify-center items-center">
      404 Not Found
    </div>
  ),
});

const home_route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/home",
  component: () => {
    const { isSignedIn, isLoaded } = useAuth();

    const navigate = useNavigate();

    // 認証の判定
    useEffect(() => {
      if (!isSignedIn && isLoaded) {
        toast.error("ログインしてください");
        // リダイレクト
        navigate({
          to: "/",
        });
      }
    }, [isSignedIn, navigate]);

    return (
      <HomeLayout>
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </HomeLayout>
    );
  },
});

const reservations_route = createRoute({
  getParentRoute: () => home_route,
  path: "/",
  component: () => <WeeklyReservations />,
  validateSearch: (search: Record<string, unknown>) => {
    if (!search.start_date) {
      const today = new Date();
      const monday = getMondayOfThisWeek(today);
      return {
        start_date: monday,
      };
    }

    if (typeof search.start_date === "string") {
      const date = new Date(search.start_date);
      return {
        start_date: date,
      };
    }

    throw new Error("Invalid search");
  },
});

const my_reservations_route = createRoute({
  getParentRoute: () => home_route,
  path: "/my_reservations",
  component: () => <WeeklyMyReservations />,
  validateSearch: (search: Record<string, unknown>) => {
    if (!search.start_date) {
      const today = new Date();
      const monday = getMondayOfThisWeek(today);
      return {
        start_date: monday,
      };
    }

    if (typeof search.start_date === "string") {
      const date = new Date(search.start_date);
      return {
        start_date: date,
      };
    }

    throw new Error("Invalid search");
  },
});

const admin_route = createRoute({
  getParentRoute: () => home_route,
  path: "/admin-this-is-a-secret",
  component: () => <AdminPanel />,
  validateSearch: (search: Record<string, unknown>) => {
    if (!search.start_date) {
      const today = new Date();
      const monday = getMondayOfThisWeek(today);
      return {
        start_date: monday,
      };
    }

    if (typeof search.start_date === "string") {
      const date = new Date(search.start_date);
      return {
        start_date: date,
      };
    }

    throw new Error("Invalid search");
  },
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
