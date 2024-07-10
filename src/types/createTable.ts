import { ReservationResponse, slotToNumber } from "./ReservationResponse";

export const createTable = (data: {
  reservations: ReservationResponse[];
  start_date: Date;
  end_date: Date;
}) => {
  // まず空の時間割を作成
  // start_dateからend_dateまでの日付で作成
  const table: {
    date: Date;
    reservations: Array<ReservationResponse | undefined>;
  }[] = [];

  const date_width = data.end_date.getDate() - data.start_date.getDate() + 1;

  for (let i = 0; i < date_width; i++) {
    const date = new Date(
      data.start_date.getFullYear(),
      data.start_date.getMonth(),
      data.start_date.getDate() + i
    );
    table.push({
      date: date,
      reservations: [undefined, undefined, undefined, undefined],
    });
  }

  // 該当する予約を挿入

  for (const reservation of data.reservations) {
    const index = reservation.date.getDate() - data.start_date.getDate();

    table[index].reservations[slotToNumber(reservation.slot) - 1] = reservation;
  }

  return table;
};
