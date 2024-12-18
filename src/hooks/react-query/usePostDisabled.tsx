import { convertFromDate } from "@/utils/date/convertFromDate";
import { reservFetch } from "@/utils/fetch/reservFetch";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePostDisabled = () => {
  const queryClient = useQueryClient();

  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      room_uuid: string;
      date: Date;
      slot: string;
    }) => {
      const raw_date = convertFromDate(data.date);

      const result = (await reservFetch(`/rooms/to-disable/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getToken()}`,
        },
        body: JSON.stringify({
          room_uuid: data.room_uuid,
          date: raw_date,
          slot: data.slot,
        }),
      })) as { status: number; data: { message: string } };

      if (result.status !== 200) {
        throw new Error(result.data.message);
      }

      return result;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reservations"],
      });
    },
  });
};
