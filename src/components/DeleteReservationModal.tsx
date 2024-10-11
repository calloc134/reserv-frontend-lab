import { ModalState } from "@/hooks/useDeleteReservationModal";
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

export const DeleteReservationModal = ({
  isOpened,
  onClickCancel,
  onClickAccept,
  modalState,
}: {
  isOpened: boolean;
  onClickCancel: () => void;
  onClickAccept: () => void;
  modalState: ModalState | null;
}) => {
  return (
    <AlertDialog open={isOpened} onOpenChange={onClickCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>予約のキャンセル</AlertDialogTitle>
          <AlertDialogDescription>
            {modalState !== null ? (
              <div className="flex flex-col gap-4">
                <table className="table-auto w-full">
                  <tbody className="text-black">
                    <tr>
                      <td className="border px-4 py-2">日付</td>
                      <td className="border px-4 py-2">
                        {modalState.date.getMonth() + 1}月
                        {modalState.date.getDate()}日 (
                        {
                          ["日", "月", "火", "水", "木", "金", "土"][
                            modalState.date.getDay()
                          ]
                        }
                        )
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2">時間</td>
                      <td className="border px-4 py-2">
                        {modalState.slot_number}限
                      </td>
                    </tr>
                    <tr>
                      <td className="border px-4 py-2">部屋</td>
                      <td className="border px-4 py-2">
                        {modalState.room_name}
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
          <AlertDialogCancel onClick={onClickCancel}>
            今のナシ
          </AlertDialogCancel>
          <AlertDialogAction onClick={onClickAccept}>
            予約の取り消し
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
