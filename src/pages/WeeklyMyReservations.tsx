import { useState, useMemo } from "react";
import { useGetWeeklyMyReservations } from "../hooks/useGetWeeklyMyReservations";
import { createTable } from "../utils/createTable";
import { useAuth } from "@clerk/clerk-react";
import { useDeleteReservation } from "../hooks/useDeleteReservation";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { ReservationResponse, slotToNumber } from "@/types/ReservationResponse";

export const WeeklyMyReservations = () => {
  const { data } = useGetWeeklyMyReservations();

  const { mutateAsync } = useDeleteReservation();

  // 予約一覧を作成する
  // start_dateからend_dateまでの日付を表示
  // 時間割の形式となる
  // 時間割は平日のみ、コマは四限まで
  // 予約がある場合は、その予約を表示する

  const table_data = useMemo(() => {
    return createTable(data);
  }, [data]);

  const user = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [dialogRord, setDialogRord] = useState<ReservationResponse | null>(
    null
  );

  const cancelHandler = async (reservation_uuid: string) => {
    try {
      await mutateAsync(reservation_uuid);
    } catch (error: unknown) {
      toast.error("キャンセルに失敗しました。\n" + (error as Error).message);
      return;
    }

    toast.success("キャンセルしました");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center">
        <h1 className="text-3xl font-bold text-gray-800">自分の予約一覧(週)</h1>
      </div>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-8 xl:grid-cols-10 gap-4 w-full justify-center">
          {table_data.map((x) => {
            return (
              <div
                key={x.date.toString()}
                className="p-4 bg-white rounded-lg col-span-1 sm:col-span-2 md:col-span-2 border-2 border-black"
              >
                <div className="text-center text-lg font-semibold text-gray-700 mb-4">
                  {x.date.getMonth() + 1}月{x.date.getDate()}日 (
                  {["日", "月", "火", "水", "木", "金", "土"][x.date.getDay()]})
                </div>
                <div>
                  {x.reservations.map((y, i) => {
                    return (
                      <div key={i} className="py-2 border-b last:border-none">
                        {y.length > 0 ? (
                          <div className="text-gray-800 gap-2 flex items-center flex-col">
                            <span className="text-gray-600">{i + 1}限: </span>
                            {y.map((z) => {
                              return (
                                <div
                                  className={
                                    "text-gray-800 gap-2 flex items-center rounded-lg p-2 border-2 border-gray-300 " +
                                    (z.user?.user_id === user.userId
                                      ? " cursor-pointer hover:bg-red-100"
                                      : "")
                                  }
                                  onClick={async () => {
                                    if (z.user?.user_id === user.userId) {
                                      console.debug(z.rord_uuid);
                                      setDialogRord(z);
                                      setIsOpen(true);
                                    }
                                  }}
                                >
                                  <span className="font-medium">
                                    {z.room.name}:
                                  </span>
                                  {user.userId === z.user?.user_id ? (
                                    <span className="text-red-500">
                                      {z.user?.name} (自分)
                                    </span>
                                  ) : z.user === null ? (
                                    <span className="text-gray-500">
                                      利用不可
                                    </span>
                                  ) : (
                                    <span className="font-medium">
                                      {z.user?.name}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-gray-500">{i + 1}限: 空き</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>予約のキャンセル</AlertDialogTitle>
              <AlertDialogDescription>
                {dialogRord !== null ? (
                  <div className="flex flex-col gap-4">
                    <table className="table-auto w-full">
                      <tbody className="text-black">
                        <tr>
                          <td className="border px-4 py-2">日付</td>
                          <td className="border px-4 py-2">
                            {dialogRord.date.getMonth() + 1}月
                            {dialogRord.date.getDate()}日
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">時間</td>
                          <td className="border px-4 py-2">
                            {slotToNumber(dialogRord.slot)}限
                          </td>
                        </tr>
                        <tr>
                          <td className="border px-4 py-2">部屋</td>
                          <td className="border px-4 py-2">
                            {dialogRord.room.name}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="text-red-500 text-sm">
                      この予定をキャンセルしますか？キャンセルすると元に戻せません。
                    </div>
                  </div>
                ) : null}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsOpen(false)}>
                今のナシ
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (dialogRord !== null) {
                    cancelHandler(dialogRord.rord_uuid);
                    setIsOpen(false);
                  }
                }}
              >
                予約の取り消し
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
