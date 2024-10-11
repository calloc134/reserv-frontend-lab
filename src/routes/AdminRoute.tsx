import { LoadingFallback } from "@/components/LoadingFallback";
import { AdminPanel } from "@/pages/AdminPanel";
import { createLazyRoute } from "@tanstack/react-router";

export const AdminRoute = createLazyRoute("/home/admin-this-is-a-secret")({
  component: () => <AdminPanel />,
  pendingComponent: () => <LoadingFallback />,
});
