import { LoginPage } from "@/pages/LoginPage";
import { createLazyRoute } from "@tanstack/react-router";

export const IndexRoute = createLazyRoute("/")({
    component: () => <LoginPage />,
})