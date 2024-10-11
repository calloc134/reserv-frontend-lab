import {
  ReservationResponse,
  slot_length,
  slotToNumber,
} from "../types/dto/ReservationResponse";

// 一日分の時間割
export type Table = {
  date: Date;
  reservation_slots: Array<ReservationResponse[]>;
};

export const createTables = (data: {
  reservations: ReservationResponse[];
  start_date: Date;
  end_date: Date;
}) => {
  // まず空の時間割を作成
  // start_dateからend_dateまでの日付で作成
  const table: Table[] = [];

  // 何日分の時間割を作成するか
  // 差分より幅を作成。異なる月同士でも動作するように
  const date_width =
    Math.ceil(
      (data.end_date.getTime() - data.start_date.getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;

  // 時間割テーブルの作成
  for (let i = 0; i < date_width; i++) {
    const date = new Date(data.start_date);
    date.setDate(data.start_date.getDate() + i);
    table.push({
      date: date,
      // unionのキーの数だけ配列を作成
      reservation_slots: Array.from({ length: slot_length }, () => []),
    });
  }

  // 該当する予約を配列に追加していく
  for (const reservation of data.reservations) {
    const index = Math.floor(
      (new Date(reservation.date).getTime() - data.start_date.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    table[index].reservation_slots[slotToNumber(reservation.slot) - 1].push(
      reservation
    );
  }

  return table;
};
