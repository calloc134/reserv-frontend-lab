import { Table } from "@/utils/createTables";
import { getFormatDateString } from "@/utils/date/getFormatDateString";
import { getToday } from "@/utils/date/getToday";
import { differenceInDays } from "date-fns";

export const MyReservationCard = ({
  table_data,
  onClickReservationArg,
  my_user_id,
}: {
  table_data: Table;
  onClickReservationArg: ({
    rord_uuid,
    date,
    slot_number,
    room_name,
  }: {
    rord_uuid: string;
    date: Date;
    slot_number: number;
    room_name: string;
  }) => void;
  my_user_id?: string;
}) => {
  const now_date = getToday();
  return (
    <div className="p-4 bg-white rounded-lg col-span-1 sm:col-span-2 md:col-span-2 border-2 border-black">
      <div className="text-center text-lg font-semibold text-gray-700 mb-4">
        {getFormatDateString(table_data.date)}
      </div>
      <div>
        {table_data.reservation_slots.map(
          (reservation_slot, reservation_slot_index) => {
            return (
              <div
                key={reservation_slot_index}
                className="py-2 border-b last:border-none"
              >
                {reservation_slot.length === 0 ? (
                  <div className="text-gray-500">
                    {reservation_slot_index + 1}限: 空き
                  </div>
                ) : (
                  <div className="text-gray-800 gap-2 flex items-center flex-col">
                    <span className="text-gray-600">
                      {reservation_slot_index + 1}限:{" "}
                    </span>
                    {reservation_slot.map((reservation, reservation_index) => {
                      // 過去の予約は削除できない
                      const deletable =
                        reservation.user?.user_id === my_user_id &&
                        differenceInDays(now_date, table_data.date) <= 0;
                      true;
                      return (
                        <div
                          key={reservation_index}
                          className={
                            "text-gray-800 gap-2 flex items-center rounded-lg p-2 border-2 border-gray-300 " +
                            (deletable
                              ? " cursor-pointer hover:bg-red-100"
                              : "")
                          }
                          onClick={async () => {
                            if (!deletable) {
                              return;
                            }
                            await onClickReservationArg({
                              rord_uuid: reservation.rord_uuid,
                              date: table_data.date,
                              slot_number: reservation_slot_index + 1,
                              room_name: reservation.room.name,
                            });
                          }}
                        >
                          <span className="font-medium">
                            {reservation.room.name}:
                          </span>
                          {my_user_id &&
                          reservation.user?.user_id === my_user_id ? (
                            <span className="text-red-500">
                              {reservation.user.name} (自分)
                            </span>
                          ) : reservation.user === null ? (
                            <span className="text-gray-500">利用不可</span>
                          ) : (
                            <span className="font-medium">
                              {reservation.user.name}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};
