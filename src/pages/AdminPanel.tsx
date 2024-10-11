import { useCallback, useMemo } from "react";
import { createTables } from "../utils/createTables";
import { useAuth } from "@clerk/clerk-react";
import { useGetWeeklyReservations } from "../hooks/react-query/useGetWeeklyReservations";
import { Slot } from "@/types/dto/ReservationResponse";
import toast from "react-hot-toast";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCreateReservationModal } from "@/hooks/useCreateReservationModal";
import { ReservationCard } from "@/components/ReservationCard";
import { DatePaginator } from "@/components/DatePaginator";
import { usePostDisabled } from "@/hooks/react-query/usePostDisabled";
import { DisableReservationModal } from "@/components/DisableReservationModal";

export const AdminPanel = () => {
  const { start_date } = useSearch({ from: "/home/admin-this-is-a-secret" });
  const navigate = useNavigate();

  const { userId } = useAuth();

  const { data } = useGetWeeklyReservations(start_date);
  const { mutateAsync } = usePostDisabled();

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
        toast.success("利用禁止の登録が完了しました");
      } catch (error) {
        toast.error(
          `利用禁止'の登録に失敗しました。\n${(error as Error).message}`
        );
      }
    },
    [mutateAsync, openModal]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center flex-row gap-4">
        <DatePaginator
          onClickPrevious={() =>
            navigate({
              to: "/home/admin-this-is-a-secret",
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
              to: "/home/admin-this-is-a-secret",
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
          {tables_data.map((table_data) => (
            <ReservationCard
              key={table_data.date.toString()}
              table_data={table_data}
              my_user_id={userId ? userId : undefined}
              onClickReservationSlotArg={onClickReservationSlot}
            />
          ))}
        </div>
        <DisableReservationModal
          isOpened={isOpened}
          availableRooms={availableRooms}
          onClickCancel={onClickCancel}
          onClickAccept={onClickAccept}
        />
      </div>
    </div>
  );
};
