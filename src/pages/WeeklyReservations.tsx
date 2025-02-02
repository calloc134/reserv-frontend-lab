import { useCallback, useMemo } from "react";
import { createTables } from "../utils/createTables";
import { useAuth } from "@clerk/clerk-react";
import { useGetWeeklyReservations } from "../hooks/react-query/useGetWeeklyReservations";
import { Slot } from "@/types/dto/ReservationResponse";
import { usePostReservation } from "@/hooks/react-query/usePostReservation";
import toast from "react-hot-toast";
import { Link, useSearch } from "@tanstack/react-router";
import { CreateReservationModal } from "@/components/CreateReservationModal";
import { useCreateReservationModal } from "@/hooks/useCreateReservationModal";
import { ReservationCard } from "@/components/ReservationCard";
import { DatePaginator } from "@/components/DatePaginator";
import { addWeeks } from "date-fns";

export const WeeklyReservations = () => {
  const { start_date } = useSearch({ from: "/home/" });

  const { userId } = useAuth();

  const { data } = useGetWeeklyReservations(start_date);
  const { mutateAsync } = usePostReservation();

  // 予約一覧を作成する
  // start_dateからend_dateまでの日付を表示
  // 時間割の形式となる
  // 時間割は平日のみ、コマは四限まで
  // 予約がある場合は、その予約を表示する

  const createTableCallback = useCallback(
    (data: Parameters<typeof createTables>[0]) => {
      return createTables(data);
    },
    []
  );
  const tables_data = useMemo(() => {
    if (!data) {
      return [];
    }
    return createTableCallback(data);
  }, [data, createTableCallback]);

  const { isOpened, openModal, onClickCancel, onClickAccept, availableRooms } =
    useCreateReservationModal();

  const onClickReservationSlot = useCallback(
    async (date: Date, slot: Slot) => {
      const alert_result = await openModal({ date, slot });
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
      } catch (error) {
        toast.error(`予約に失敗しました。\n${(error as Error).message}`);
      }
    },
    [mutateAsync, openModal]
  );

  const previous_date = useMemo(() => addWeeks(start_date, -1), [start_date]);
  const next_date = useMemo(() => addWeeks(start_date, 1), [start_date]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center">
        <div className="flex w-1/2  flex-row gap-4 justify-center">
          <div className="p-2 bg-white rounded-lg border-2 border-black w-1/2 text-center">
            予約一覧(週)
          </div>
          <Link
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
          PreviousLink={(children: React.ReactNode) => {
            return (
              <Link to="/home" search={{ start_date: previous_date }}>
                {children}
              </Link>
            );
          }}
          NextLink={(children: React.ReactNode) => {
            return (
              <Link to="/home" search={{ start_date: next_date }}>
                {children}
              </Link>
            );
          }}
        />
      </div>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-8 xl:grid-cols-10 gap-4 w-full justify-center">
          {tables_data.map((table_data) => (
            <ReservationCard
              key={table_data.date.toString()}
              table_data={table_data}
              my_user_id={userId ? userId : undefined}
              onClickReservationSlotArg={onClickReservationSlot}
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
