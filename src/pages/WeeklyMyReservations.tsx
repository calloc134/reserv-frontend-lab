import { useState, useMemo, useCallback } from "react";
import { useGetWeeklyMyReservations } from "../hooks/react-query/useGetWeeklyMyReservations";
import { createTable } from "../utils/createTable";
import { useAuth } from "@clerk/clerk-react";
import { useDeleteReservation } from "../hooks/react-query/useDeleteReservation";
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
import {
  ReservationResponse,
  slotToNumber,
} from "@/types/dto/ReservationResponse";
import { Button } from "@/components/ui/button";
import { Link, useSearch } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";

export const WeeklyMyReservations = () => {
  // string型なら
  const { start_date } = useSearch({
    from: "/home/my_reservations",
  });
  const navigate = useNavigate();

  const { data } = useGetWeeklyMyReservations(start_date);

  const { mutateAsync } = useDeleteReservation();

  // 予約一覧を作成する
  // start_dateからend_dateまでの日付を表示
  // 時間割の形式となる
  // 時間割は平日のみ、コマは四限まで
  // 予約がある場合は、その予約を表示する

  const createTableCallback = useCallback(() => {
    return createTable(data);
  }, [data]);

  const table_data = useMemo(createTableCallback, [createTableCallback]);

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
        <div className="flex w-1/2  flex-row gap-4 justify-center">
          <Link
            // search={{ start_date: convertFromDate(start_date) }}
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
          <Button
            variant={"secondary"}
            onClick={() =>
              navigate({
                to: "/home/my_reservations",
                search: {
                  start_date: new Date(
                    start_date.getFullYear(),
                    start_date.getMonth(),
                    start_date.getDate() - 7
                  ),
                },
              })
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-caret-left"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#2c3e50"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M14 6l-6 6l6 6v-12" />
            </svg>
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">
            自分の予約一覧(週)
          </h1>
          <Button
            variant={"secondary"}
            onClick={() =>
              navigate({
                to: "/home/my_reservations",
                search: {
                  start_date: new Date(
                    start_date.getFullYear(),
                    start_date.getMonth(),
                    start_date.getDate() + 7
                  ),
                },
              })
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-caret-right"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#2c3e50"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M10 18l6 -6l-6 -6v12" />
            </svg>
          </Button>
        </div>
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
                  {x.reservation_slots.map((y, i) => {
                    return (
                      <div key={i} className="py-2 border-b last:border-none">
                        {y.length > 0 ? (
                          <div className="text-gray-800 gap-2 flex items-center flex-col">
                            <span className="text-gray-600">{i + 1}限: </span>
                            {y.map((z) => {
                              return (
                                <div
                                  key={z.rord_uuid}
                                  className={
                                    "text-gray-800 gap-2 flex items-center rounded-lg p-2 border-2 border-gray-300 " +
                                    (z.user?.user_id === user.userId
                                      ? " cursor-pointer hover:bg-red-100"
                                      : "")
                                  }
                                  onClick={async () => {
                                    if (z.user?.user_id === user.userId) {
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
