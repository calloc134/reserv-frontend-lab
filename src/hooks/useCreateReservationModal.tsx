// 予約作成アラート用のカスタムフック
// 引数なし
// 戻り値:  アラートを開くためのPromise
// 引数: アラートに表示する内容(日付、時限)
// 戻り値: 承諾したかキャンセルしたか
// 承諾したなら、どの部屋を選択したか

import { Slot } from "@/types/dto/ReservationResponse";
import { RoomResponse } from "@/types/dto/RoomResponse";
import { useState } from "react";
import { Result, ok, err } from "neverthrow";
import { getAvailableRooms } from "@/utils/fetch/getAvailableRooms";
import { useAuth } from "@clerk/clerk-react";

type handlers = {
  onClickCancel: () => void;
  onClickAccept: (room_uuid: string) => void;
};

export const useCreateReservationModal = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<RoomResponse[] | null>(
    null
  );

  const [handlers, setHandlers] = useState<handlers>({
    onClickCancel: () => {},
    onClickAccept: () => {},
  });

  const { getToken } = useAuth();

  const openModal = async ({ date, slot }: { date: Date; slot: Slot }) => {
    setIsOpened(true);
    const token = await getToken();
    const availableRooms: RoomResponse[] = await getAvailableRooms(
      date,
      slot,
      token
    );
    return new Promise<Result<string, undefined>>((resolve) => {
      setAvailableRooms(availableRooms);
      setHandlers({
        onClickCancel: () => {
          console.log("cancel");
          setIsOpened(false);
          setAvailableRooms(null);
          resolve(err(undefined));
        },
        onClickAccept: (room_uuid: string) => {
          console.log("accept");
          setIsOpened(false);
          setAvailableRooms(null);
          resolve(ok(room_uuid));
        },
      });
    });
  };

  return { openModal, isOpened, availableRooms, ...handlers };
};
