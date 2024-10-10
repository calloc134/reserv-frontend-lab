import { LoadingFallback } from "@/components/LoadingFallback";
import { WeeklyMyReservations } from "@/pages/WeeklyMyReservations";
import { createLazyRoute } from "@tanstack/react-router";

export const MyReservationsRoute = createLazyRoute("/home/my_reservations")({
  component: () => <WeeklyMyReservations />,
  pendingComponent: () => <LoadingFallback />,
});
