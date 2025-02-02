import { useMemo, useCallback } from "react";
import { useGetWeeklyMyReservations } from "../hooks/react-query/useGetWeeklyMyReservations";
import { createTables } from "../utils/createTables";
import { useAuth } from "@clerk/clerk-react";
import { useDeleteReservation } from "../hooks/react-query/useDeleteReservation";
import { Link, useSearch } from "@tanstack/react-router";
import { DatePaginator } from "@/components/DatePaginator";
import { useDeleteReservationModal } from "@/hooks/useDeleteReservationModal";
import toast from "react-hot-toast";
import { MyReservationCard } from "@/components/MyReservationCard";
import { DeleteReservationModal } from "@/components/DeleteReservationModal";
import { addWeeks } from "date-fns";

export const WeeklyMyReservations = () => {
  const { start_date } = useSearch({
    from: "/home/my_reservations",
  });

  const { userId } = useAuth();

  const { data } = useGetWeeklyMyReservations(start_date);
  const { mutateAsync } = useDeleteReservation();

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

  const { isOpened, openModal, onClickCancel, onClickAccept, modalState } =
    useDeleteReservationModal();

  const onClickReservation = useCallback(
    async ({
      rord_uuid,
      date,
      slot_number,
      room_name,
    }: {
      rord_uuid: string;
      date: Date;
      slot_number: number;
      room_name: string;
    }) => {
      const result = await openModal({ date, slot_number, room_name });
      if (result.isErr()) {
        return;
      }
      try {
        await mutateAsync(rord_uuid);
        toast.success("予約を取り消しました。");
      } catch (error) {
        toast.error(
          `予約の取り消しに失敗しました。\n${(error as Error).message}`
        );
      }
    },
    [openModal, mutateAsync]
  );

  const previous_date = useMemo(() => addWeeks(start_date, -1), [start_date]);
  const next_date = useMemo(() => addWeeks(start_date, 1), [start_date]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center">
        <div className="flex w-1/2  flex-row gap-4 justify-center">
          <Link
            search={{ start_date: start_date }}
            to="/home"
            className="p-2 rounded-lg border-2 border-black w-1/2 text-center bg-gray-200 hover:bg-gray-100 cursor-pointer"
          >
            予約一覧(週)
          </Link>
          <div className="p-2 bg-white rounded-lg border-2 border-black w-1/2 text-center">
            自分の予約一覧(週)
          </div>
        </div>
      </div>

      <div className="flex justify-center flex-row gap-4">
        <div className="flex justify-center flex-row gap-4">
          <DatePaginator
            PreviousLink={({ children }) => (
              <Link
                to="/home/my_reservations"
                search={{ start_date: previous_date }}
              >
                {children}
              </Link>
            )}
            NextLink={({ children }) => (
              <Link
                to="/home/my_reservations"
                search={{ start_date: next_date }}
              >
                {children}
              </Link>
            )}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-8 xl:grid-cols-10 gap-4 w-full justify-center">
          {tables_data.map((table_data) => (
            <MyReservationCard
              key={table_data.date.toString()}
              table_data={table_data}
              my_user_id={userId ? userId : undefined}
              onClickReservationArg={onClickReservation}
            />
          ))}
        </div>
        <DeleteReservationModal
          isOpened={isOpened}
          onClickCancel={onClickCancel}
          onClickAccept={onClickAccept}
          modalState={modalState}
        />
      </div>
    </div>
  );
};
