// 予約取り消しアラート用のカスタムフック
// 引数なし
// 戻り値: アラートを開くためのPromise
// 引数: アラートに表示する内容(日付、時限、部屋名？)
// 戻り値: 承諾したかキャンセルしたか
import { useState } from "react";
import { Result, ok, err } from "neverthrow";

export type ModalState = {
  date: Date;
  slot_number: number;
  room_name: string;
};

type handlers = {
  onClickCancel: () => void;
  onClickAccept: () => void;
};

export const useDeleteReservationModal = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const [handlers, setHandlers] = useState<handlers>({
    onClickCancel: () => {},
    onClickAccept: () => {},
  });

  const openModal = (state: ModalState) => {
    setIsOpened(true);
    setModalState(state);

    return new Promise<Result<void, void>>((resolve) => {
      setHandlers({
        onClickCancel: () => {
          setIsOpened(false);
          resolve(err(undefined));
        },
        onClickAccept: () => {
          setIsOpened(false);
          resolve(ok(undefined));
        },
      });
    });
  };

  return { openModal, isOpened, ...handlers, modalState };
};
