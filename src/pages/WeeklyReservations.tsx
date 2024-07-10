import { useMemo, useState } from "react";
import { createTable } from "../utils/createTable";
import { useAuth } from "@clerk/clerk-react";
import { useGetWeeklyReservations } from "../hooks/useGetWeeklyReservations";
import { getAvailableRooms } from "../utils/getAvailableRooms";
import { RoomResponse } from "@/types/RoomResponse";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { numberToSlot, slot } from "@/types/ReservationResponse";
import { useNewReservation } from "@/hooks/useNewReservation";
import toast from "react-hot-toast";

export const WeeklyReservations = () => {
  const { data, error } = useGetWeeklyReservations();

  console.debug(data, error);

  // 予約一覧を作成する
  // start_dateからend_dateまでの日付を表示
  // 時間割の形式となる
  // 時間割は平日のみ、コマは四限まで
  // 予約がある場合は、その予約を表示する

  const table_data = useMemo(() => {
    return createTable(data);
  }, [data]);

  const user = useAuth();

  const [availableRooms, setAvailableRooms] = useState<RoomResponse[]>([]);

  const [isOpened, setIsOpened] = useState(false);

  const [dialogConfig, setDialogConfig] = useState<{
    date: Date;
    slot: slot;
  } | null>(null);

  const { mutateAsync } = useNewReservation();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center">
        <h1 className="text-3xl font-bold text-gray-800">予約一覧(週)</h1>
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
                      <div
                        key={i}
                        className="py-2 border-b last:border-none cursor-pointer hover:bg-gray-100 rounded-md"
                        onClick={async () => {
                          const slot = numberToSlot(i + 1) || "first";
                          const rooms = await getAvailableRooms(
                            x.date,
                            slot,
                            await user.getToken()
                          );
                          console.debug(rooms);
                          setAvailableRooms(rooms);

                          setDialogConfig({
                            date: x.date,
                            slot: slot,
                          });

                          setIsOpened(true);
                        }}
                      >
                        {y.length > 0 ? (
                          <div className="text-gray-800 gap-2 flex items-center flex-col">
                            <span className="text-gray-600">{i + 1}限: </span>
                            {y.map((z) => {
                              return (
                                <div className="text-gray-800 gap-2 flex items-center rounded-lg p-2 border-2 border-gray-300">
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
        <AlertDialog open={isOpened} onOpenChange={setIsOpened}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>利用可能な部屋</AlertDialogTitle>
              <AlertDialogDescription>
                <div className="flex flex-col gap-4">
                  <h1>予約する部屋を選択してください。</h1>
                  {availableRooms.map((x) => {
                    return (
                      <div
                        key={x.room_uuid}
                        className="p-4 bg-white rounded-lg border-2 border-black cursor-pointer hover:bg-gray-100"
                        onClick={async () => {
                          try {
                            await mutateAsync({
                              room_uuid: x.room_uuid,
                              slot: dialogConfig?.slot || "first",
                              date: dialogConfig?.date || new Date(),
                            });
                          } catch (e) {
                            toast.error((e as Error).message);
                            return;
                          }

                          toast.success("予約しました。");
                          setIsOpened(false);
                        }}
                      >
                        <div className="text-center text-lg font-semibold text-gray-700 mb-4">
                          {x.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsOpened(false)}>
                キャンセル
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
