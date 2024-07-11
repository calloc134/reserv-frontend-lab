import {
  ReservationResponse,
  slotToNumber,
} from "../types/ReservationResponse";

export const createTable = (data: {
  reservations: ReservationResponse[];
  start_date: Date;
  end_date: Date;
}) => {
  // まず空の時間割を作成
  // start_dateからend_dateまでの日付で作成
  const table: {
    date: Date;
    reservations: Array<ReservationResponse[]>;
  }[] = [];

  // 日時の幅を計算
  // 異なる月同士でも動作するように
  const date_width =
    Math.ceil(
      (data.end_date.getTime() - data.start_date.getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;

  for (let i = 0; i < date_width; i++) {
    const date = new Date(data.start_date);
    date.setDate(data.start_date.getDate() + i);
    table.push({
      date: date,
      reservations: [[], [], [], []],
    });
  }

  // 該当する予約を挿入

  for (const reservation of data.reservations) {
    const index = Math.floor(
      (new Date(reservation.date).getTime() - data.start_date.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    table[index].reservations[slotToNumber(reservation.slot) - 1].push(
      reservation
    );
  }

  return table;
};
