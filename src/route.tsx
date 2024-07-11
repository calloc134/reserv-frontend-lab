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
import { ClipLoader } from "react-spinners";

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
    const { isSignedIn } = useAuth();

    const navigate = useNavigate();

    // 認証の判定
    useEffect(() => {
      if (!isSignedIn) {
        toast.error("ログインしてください");
        // リダイレクト
        navigate({
          to: "/",
        });
      }
    }, [isSignedIn, navigate]);

    return (
      <HomeLayout>
        <Suspense
          fallback={
            <div className="flex h-screen justify-center items-center">
              <div className="p-16 bg-white rounded-lg col-span-1 sm:col-span-2 md:col-span-2 border-2 border-black">
                <ClipLoader color="#000" loading={true} size={50} />
              </div>
            </div>
          }
        >
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
});

const my_reservations_route = createRoute({
  getParentRoute: () => home_route,
  path: "/my_reservations",
  component: () => <WeeklyMyReservations />,
});

const routeTree = rootRoute.addChildren([
  index_route,
  home_route.addChildren([reservations_route, my_reservations_route]),
  not_found_route,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
