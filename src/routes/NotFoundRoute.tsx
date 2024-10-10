import { NotFound } from "@/components/NotFound"
import { createLazyRoute } from "@tanstack/react-router"

export const NotFoundRoute = createLazyRoute("/*")({
    component: () => <NotFound />,
})