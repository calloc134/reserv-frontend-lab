import { useCallback, useMemo } from "react";
import { createTable } from "../utils/createTable";
import { useAuth } from "@clerk/clerk-react";
import { useGetWeeklyReservations } from "../hooks/react-query/useGetWeeklyReservations";
import { slot } from "@/types/dto/ReservationResponse";
import { usePostReservation } from "@/hooks/react-query/usePostReservation";
import toast from "react-hot-toast";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { CreateReservationModal } from "@/components/CreateReservationModal";
import { useCreateReservationModal } from "@/hooks/useCreateReservationModal";
import { Card } from "@/components/Card";
import { DatePaginator } from "@/components/DatePaginator";

export const WeeklyReservations = () => {
  const { start_date } = useSearch({ from: "/home/" });
  const navigate = useNavigate();

  const { userId } = useAuth();

  const { data } = useGetWeeklyReservations(start_date);
  const { mutateAsync } = usePostReservation();

  // 予約一覧を作成する
  // start_dateからend_dateまでの日付を表示
  // 時間割の形式となる
  // 時間割は平日のみ、コマは四限まで
  // 予約がある場合は、その予約を表示する

  const createTableCallback = useCallback(
    (data: Parameters<typeof createTable>[0]) => {
      return createTable(data);
    },
    []
  );
  const table_data = useMemo(() => {
    if (!data) {
      return [];
    }
    return createTableCallback(data);
  }, [data, createTableCallback]);

  const { isOpened, openAlert, onClickCancel, onClickAccept, availableRooms } =
    useCreateReservationModal();

  const onClickBlank = useCallback(
    async (date: Date, slot: slot) => {
      const alert_result = await openAlert({ date, slot });
      if (alert_result.isErr()) {
        return;
      }
      const room_uuid = alert_result.value;
      try {
        await mutateAsync({
          date,
          slot,
          room_uuid,
        });
        toast.success("予約が完了しました");
      } catch (e) {
        console.error(e);
        toast.error(`${e}`);
      }
    },
    [mutateAsync, openAlert]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center">
        <div className="flex w-1/2  flex-row gap-4 justify-center">
          <div className="p-2 bg-white rounded-lg border-2 border-black w-1/2 text-center">
            予約一覧(週)
          </div>
          <Link
            // search={{ start_date: convertFromDate(start_date) }}
            search={{ start_date: start_date }}
            to="/home/my_reservations"
            className="p-2 rounded-lg border-2 border-black w-1/2 text-center bg-gray-200 hover:bg-gray-100 cursor-pointer"
          >
            自分の予約一覧(週)
          </Link>
        </div>
      </div>

      <div className="flex justify-center flex-row gap-4">
        <DatePaginator
          onClickPrevious={() =>
            navigate({
              to: "/home",
              search: {
                start_date: new Date(
                  start_date.getFullYear(),
                  start_date.getMonth(),
                  start_date.getDate() - 7
                ),
              },
            })
          }
          onClickNext={() =>
            navigate({
              to: "/home",
              search: {
                start_date: new Date(
                  start_date.getFullYear(),
                  start_date.getMonth(),
                  start_date.getDate() + 7
                ),
              },
            })
          }
        />
      </div>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-8 xl:grid-cols-10 gap-4 w-full justify-center">
          {table_data.map((x) => (
            <Card
              key={x.date.toString()}
              table_data={x}
              my_user_id={userId ? userId : undefined}
              onClickBlank={onClickBlank}
            />
          ))}
        </div>
        <CreateReservationModal
          isOpened={isOpened}
          availableRooms={availableRooms}
          onClickCancel={onClickCancel}
          onClickAccept={onClickAccept}
        />
      </div>
    </div>
  );
};
