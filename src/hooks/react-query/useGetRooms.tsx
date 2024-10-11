import { useAuth } from "@clerk/clerk-react";
import { reservFetch } from "@/utils/fetch/reservFetch";
import { useSuspenseQuery } from "@tanstack/react-query";
import { RoomResponse } from "@/types/dto/RoomResponse";

// 内部的にtanstack queryを利用する
export const useGetRooms = () => {
  const { getToken } = useAuth();

  const { data, error, isLoading } = useSuspenseQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const query_result = (await reservFetch("/rooms/", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      })) as {
        status: number;
        data: RoomResponse[];
      };

      return query_result.data;
    },
  });

  return { data, error, isLoading };
};
