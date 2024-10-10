import { LoadingFallback } from "@/components/LoadingFallback";
import { WeeklyReservations } from "@/pages/WeeklyReservations";
import { createLazyRoute } from "@tanstack/react-router";

export const ReservationsRoute = createLazyRoute("/home/")({
  component: () => <WeeklyReservations />,
  pendingComponent: () => <LoadingFallback />,
});
