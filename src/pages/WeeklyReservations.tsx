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
import { ClipLoader } from "react-spinners";
import { getMondayOfThisWeek } from "@/utils/getMondayOfWeek";
import { Button } from "@/components/ui/button";

export const WeeklyReservations = () => {
  const [startDate, setStartDate] = useState(getMondayOfThisWeek());
  const { data, error } = useGetWeeklyReservations(startDate);

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

  const [availableRooms, setAvailableRooms] = useState<RoomResponse[] | null>(
    null
  );

  const [isOpened, setIsOpened] = useState(false);

  const [dialogConfig, setDialogConfig] = useState<{
    date: Date;
    slot: slot;
  } | null>(null);

  const { mutateAsync } = useNewReservation();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center flex-row gap-4">
        <Button
          variant={"secondary"}
          onClick={() =>
            setStartDate(
              new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate() - 7
              )
            )
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
            setStartDate(
              new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate() + 7
              )
            )
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
                  {x.reservations.map((y, i) => {
                    return (
                      <div
                        key={i}
                        className="py-2 border-b last:border-none cursor-pointer hover:bg-gray-100 rounded-md"
                        onClick={async () => {
                          setAvailableRooms(null);
                          setIsOpened(true);
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
                  <h1>この部屋で予約を行います。</h1>
                  {availableRooms === null ? (
                    <div className="p-4 bg-white rounded-lg flex justify-center">
                      <ClipLoader color="#000" loading={true} size={50} />
                    </div>
                  ) : availableRooms.length === 0 ? (
                    <div className="p-4 bg-white rounded-lg border-2 border-black">
                      <div className="text-center text-lg font-semibold text-gray-700 mb-4">
                        利用可能な部屋がありません。
                      </div>
                    </div>
                  ) : (
                    availableRooms.map((x) => {
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
                              toast.error(
                                "エラーが発生しました。\n" +
                                  (e as Error).message ||
                                  "エラーが発生しました。"
                              );
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
                    })
                  )}
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
