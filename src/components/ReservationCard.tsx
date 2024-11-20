import { numberToSlot, Slot } from "@/types/dto/ReservationResponse";
import { Table } from "@/utils/createTables";
import { getFormatDateString } from "@/utils/date/getFormatDateString";
import { getToday } from "@/utils/date/getToday";
import { differenceInDays } from "date-fns";
import { useCallback } from "react";

export const ReservationCard = ({
  key,
  table_data,
  onClickReservationSlotArg,
  my_user_id,
}: {
  key: string;
  table_data: Table;
  onClickReservationSlotArg: (date: Date, slot: Slot) => Promise<void>;
  my_user_id?: string;
}) => {
  const onClickReservationSlot = useCallback(
    async ({ date, slot_number }: { date: Date; slot_number: number }) => {
      const number_to_slot_result = numberToSlot(slot_number);
      if (number_to_slot_result.isErr()) {
        throw new Error("Invalid number");
      }
      await onClickReservationSlotArg(date, number_to_slot_result.value);
    },
    [onClickReservationSlotArg]
  );

  const now_date = getToday();

  return (
    <div
      key={key}
      className="p-4 bg-white rounded-lg col-span-1 sm:col-span-2 md:col-span-2 border-2 border-black"
    >
      <div className="text-center text-lg font-semibold text-gray-700 mb-4">
        {getFormatDateString(table_data.date)}
      </div>
      <div>
        {table_data.reservation_slots.map(
          (reservation_slot, reservation_slot_index) => {
            // 過去は予約できない
            const creatable = differenceInDays(now_date, table_data.date) <= 0;
            true;
            return (
              <div
                key={reservation_slot_index}
                className={
                  "py-2 border-b last:border-none rounded-md" +
                  (creatable ? " cursor-pointer hover:bg-gray-100 " : "")
                }
                onClick={async () => {
                  if (!creatable) {
                    return;
                  }
                  await onClickReservationSlot({
                    date: table_data.date,
                    slot_number: reservation_slot_index + 1,
                  });
                }}
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
                    {reservation_slot.map((reservation) => {
                      return (
                        <div
                          key={reservation.rord_uuid}
                          className="text-gray-800 gap-2 flex items-center rounded-lg p-2 border-2 border-gray-300"
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
