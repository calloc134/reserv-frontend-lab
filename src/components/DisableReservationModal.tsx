import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { RoomResponse } from "@/types/dto/RoomResponse";
import { ClipLoader } from "react-spinners";

export const DisableReservationModal = ({
  isOpened,
  onClickCancel,
  onClickAccept,
  availableRooms,
}: {
  isOpened: boolean;
  onClickCancel: () => void;
  onClickAccept: (room_uuid: string) => void;
  availableRooms: RoomResponse[] | null;
}) => {
  return (
    <AlertDialog open={isOpened} onOpenChange={onClickCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>利用禁止にする対象の部屋</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex flex-col gap-4">
              <h1>該当する部屋を利用禁止にします。</h1>
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
                      onClick={() => onClickAccept(x.room_uuid)}
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
          <AlertDialogCancel onClick={onClickCancel}>
            キャンセル
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
