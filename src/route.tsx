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

const rootRoute = createRootRoute({
  component: () => (
    <div>
      <Outlet />
    </div>
  ),
});

const IndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <LoginPage />,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/home/",
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
      <div>
        <Outlet />
      </div>
    );
  },
});

const routeTree = rootRoute.addChildren([IndexRoute, homeRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
