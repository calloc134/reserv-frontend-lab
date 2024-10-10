import { useAuth } from "@clerk/clerk-react";
import { reservFetch } from "../utils/reservFetch";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convertFromDate } from "../utils/convertFromDate";
import { ReservationResponseTransformed } from "../types/dto/ReservationResponseTransformed";
import { convertToDate } from "../utils/convertToDate";

// 内部的にtanstack queryを利用する
export const useGetWeeklyMyReservations = (start_date: Date) => {
  const { getToken } = useAuth();

  // 呼び出しの形式はYYYY-MM-DD
  const end_date = new Date(
    start_date.getFullYear(),
    start_date.getMonth(),
    start_date.getDate() + 4
  );

  const raw_start_date = convertFromDate(start_date);
  const raw_end_date = convertFromDate(end_date);

  const { data, error, isLoading } = useSuspenseQuery({
    queryKey: [
      "reservations",
      "weekly",
      "my-reservations",
      raw_start_date,
      raw_end_date,
    ],
    queryFn: async () => {
      const query_result = (await reservFetch(
        `/reservations/start_date/${raw_start_date}/end_date/${raw_end_date}/my-reservations/`,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      )) as {
        status: number;
        data: {
          reservations: ReservationResponseTransformed[];
          start_date: string;
          end_date: string;
        };
      };

      const start_date_or = convertToDate(query_result.data.start_date);
      if (start_date_or.isErr()) {
        throw start_date_or.error;
      }
      const end_date_or = convertToDate(query_result.data.end_date);
      if (end_date_or.isErr()) {
        throw end_date_or.error;
      }
      return {
        reservations: query_result.data.reservations.map((x) => {
          const date_or = convertToDate(x.date);
          if (date_or.isErr()) {
            throw date_or.error;
          }
          return {
            ...x,
            date: date_or.value,
          };
        }),
        start_date: start_date_or.value,
        end_date: end_date_or.value,
      };
    },
  });

  return { data, error, isLoading };
};
