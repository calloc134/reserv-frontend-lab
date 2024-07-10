import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reservFetch } from "../utils/reservFetch";
import { useAuth } from "@clerk/clerk-react";

export const useDeleteReservation = () => {
  const queryClient = useQueryClient();

  const user = useAuth();

  return useMutation({
    mutationFn: async (reservation_uuid: string) => {
      const result = (await reservFetch(`/reservations/${reservation_uuid}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${await user.getToken()}`,
        },
      })) as { status: number; data: { message: string } };

      if (result.status !== 200) {
        throw new Error(result.data.message);
      }

      return result;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reservations", "weekly", "my-reservations"],
      });
    },
  });
};
