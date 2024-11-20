import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { reservFetch } from "@/utils/fetch/reservFetch";
import { convertFromDate } from "@/utils/date/convertFromDate";

export const usePostReservation = () => {
  const { getToken } = useAuth();

  const queryClient = useQueryClient();

  const mutate = useMutation({
    mutationFn: async (data: {
      room_uuid: string;
      slot: string;
      date: Date;
    }) => {
      const raw_date = convertFromDate(data.date);

      const res = (await reservFetch("/reservations/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getToken()}`,
        },
        body: JSON.stringify({
          room_uuid: data.room_uuid,
          slot: data.slot,
          date: raw_date,
        }),
      })) as { status: number; data: { message: string } };

      if (res.status !== 200) {
        throw new Error(res.data.message);
      }

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reservations"],
      });
    },
  });

  return mutate;
};
