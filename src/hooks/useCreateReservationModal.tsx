// 予約作成アラート用のカスタムフック
// 引数なし
// 戻り値:  アラートを開くためのPromise
// 引数: アラートに表示する内容(利用可能な部屋リスト、日付、時限)
// 戻り値: 承諾したかキャンセルしたか
// 承諾したなら、どの部屋を選択したか

import { slot } from "@/types/dto/ReservationResponse";
import { RoomResponse } from "@/types/dto/RoomResponse";
import { useState } from "react";
import { Result, ok, err } from "neverthrow";
import { getAvailableRooms } from "@/utils/getAvailableRooms";
import { useAuth } from "@clerk/clerk-react";

export const useCreateReservationModal = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<RoomResponse[] | null>(
    null
  );
  const [onClickCancel, setOnClickCancel] = useState<() => void>(
    () => () => {}
  );
  const [onClickAccept, setOnClickAccept] = useState<
    (room_uuid: string) => void
  >(() => () => {});

  const { getToken } = useAuth();

  const openAlert = async ({ date, slot }: { date: Date; slot: slot }) => {
    setIsOpened(true);
    const token = await getToken();
    const availableRooms: RoomResponse[] = await getAvailableRooms(
      date,
      slot,
      token
    );
    return new Promise<Result<string, undefined>>((resolve) => {
      setAvailableRooms(availableRooms);
      setOnClickCancel(() => {
        return () => {
          console.log("cancel");
          setIsOpened(false);
          setAvailableRooms(null);
          resolve(err(undefined));
        };
      });
      setOnClickAccept(() => {
        return (room_uuid: string) => {
          console.log("accept");
          setIsOpened(false);
          setAvailableRooms(null);
          resolve(ok(room_uuid));
        };
      });
    });
  };

  return { openAlert, isOpened, availableRooms, onClickCancel, onClickAccept };
};
