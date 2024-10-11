import { createLazyRoute } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { AuthenticateLayoutPage } from "@/pages/AuthenticateLayoutPage";

export const HomeRoute = createLazyRoute("/home")({
  component: () => (
    <AuthenticateLayoutPage>
      <Outlet />
    </AuthenticateLayoutPage>
  ),
});
