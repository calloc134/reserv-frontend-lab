import { useSearch } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { convertFromDate } from "@/utils/convert/convertFromDate";
import { useCreateDisabled } from "@/hooks/react-query/useCreateDisabled";
import { useGetWeeklyReservations } from "@/hooks/react-query/useGetWeeklyReservations";
import { createTables } from "@/utils/createTables";
import { useAuth } from "@clerk/clerk-react";
import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useGetRooms } from "@/hooks/react-query/useGetRooms";
import { numberToSlot, slot } from "@/types/dto/ReservationResponse";
import toast from "react-hot-toast";

export const AdminPanel = () => {
  const { start_date } = useSearch({
    from: "/home/admin-this-is-a-secret",
  });
  const navigate = useNavigate();

  const { data } = useGetWeeklyReservations(start_date);
  const { data: room_data } = useGetRooms();

  const createTableCallback = useCallback(() => {
    return createTables(data);
  }, [data]);

  const table_data = useMemo(createTableCallback, [createTableCallback]);

  const user = useAuth();

  const [isOpened, setIsOpened] = useState(false);

  // 使えない予定を作成する
  const { mutateAsync } = useCreateDisabled();

  const [dialogConfig, setDialogConfig] = useState<{
    date: Date;
    slot: slot;
  } | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center flex-row gap-4">
        <h1 className="text-3xl font-bold text-gray-800">管理者画面</h1>
      </div>
      <div className="flex justify-center flex-row gap-4">
        <Button
          variant={"secondary"}
          onClick={() =>
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
        <h1 className="text-3xl font-bold text-gray-800">予約一覧(週)</h1>
        <Button
          variant={"secondary"}
          onClick={() =>
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
                      <div
                        key={i}
                        className="py-2 border-b last:border-none cursor-pointer hover:bg-gray-100 rounded-md"
                        onClick={async () => {
                          setDialogConfig({
                            date: x.date,
                            slot: numberToSlot(i + 1) || "first",
                          });
                          setIsOpened(true);
                        }}
                      >
                        {y.length > 0 ? (
                          <div className="text-gray-800 gap-2 flex items-center flex-col">
                            <span className="text-gray-600">{i + 1}限: </span>
                            {y.map((z) => {
                              return (
                                <div
                                  key={z.rord_uuid}
                                  className="text-gray-800 gap-2 flex items-center rounded-lg p-2 border-2 border-gray-300"
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
                <AlertDialog open={isOpened} onOpenChange={setIsOpened}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>利用不可設定</AlertDialogTitle>
                      <AlertDialogDescription>
                        利用不可にする部屋を選択してください。
                        {room_data?.map((z) => {
                          return (
                            <div key={z.room_uuid} className="flex gap-4">
                              <Button
                                variant={"secondary"}
                                onClick={async () => {
                                  if (dialogConfig === null) {
                                    toast.error("エラーが発生しました");
                                    return;
                                  }
                                  const result = await mutateAsync({
                                    room_uuid: z.room_uuid,
                                    date: convertFromDate(dialogConfig.date),
                                    slot: dialogConfig.slot,
                                  });

                                  if (result.status !== 200) {
                                    toast.error(result.data.message);
                                  } else {
                                    toast.success("利用不可にしました");
                                  }

                                  setIsOpened(false);
                                }}
                              >
                                {z.name}
                              </Button>
                            </div>
                          );
                        })}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <Button
                        variant={"secondary"}
                        onClick={() => {
                          setIsOpened(false);
                        }}
                      >
                        キャンセル
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
