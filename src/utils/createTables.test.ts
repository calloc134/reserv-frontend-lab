import { describe, it, expect } from "vitest";
import { createTables } from "./createTables";
import {
  ReservationResponse,
  slot_length,
  slotToNumber,
} from "../types/dto/ReservationResponse";
import { convertToDate } from "./date/convertToDate";
import { addDays } from "date-fns";

describe("createTables", () => {
  it("予約がない場合、空のテーブルを作成する", () => {
    const startDate = convertToDate("2023-10-01")._unsafeUnwrap();
    const endDate = convertToDate("2023-10-03")._unsafeUnwrap();

    const result = createTables({
      reservations: [],
      start_date: startDate,
      end_date: endDate,
    });

    expect(result.length).toBe(3);
    result.forEach((table, index) => {
      expect(table.date).toEqual(addDays(startDate, index));
      expect(table.reservation_slots.length).toBe(slot_length);
      table.reservation_slots.forEach((slot) => {
        expect(slot).toEqual([]);
      });
    });
  });

  it("予約がある場合、テーブルに予約を追加する", () => {
    const startDate = convertToDate("2023-10-01")._unsafeUnwrap();
    const endDate = convertToDate("2023-10-01")._unsafeUnwrap();

    const reserv1_before: ReservationResponse = {
      date: convertToDate("2023-10-01")._unsafeUnwrap(),
      slot: "first",
      rord_uuid: "dummy_rord_uuid_1",
      room: { name: "dummy_room_1", room_id: "dummy_room_id_1" },
      user: { name: "dummy_user_1", user_id: "dummy_user_id_1" },
    };
    const reserv2_before: ReservationResponse = {
      date: convertToDate("2023-10-01")._unsafeUnwrap(),
      slot: "second",
      rord_uuid: "dummy_rord_uuid_2",
      room: { name: "dummy_room_2", room_id: "dummy_room_id_2" },
      user: { name: "dummy_user_2", user_id: "dummy_user_id_2" },
    };

    const reservations: ReservationResponse[] = [
      reserv1_before,
      reserv2_before,
    ];

    const result = createTables({
      reservations,
      start_date: startDate,
      end_date: endDate,
    });

    expect(result.length).toBe(1);

    // -1しないとインデックスに対応しない
    const reserv1_after =
      result[0].reservation_slots[slotToNumber("first") - 1];
    console.log(reserv1_after);
    const reserv2_after =
      result[0].reservation_slots[slotToNumber("second") - 1];
    console.log(reserv2_after);

    expect(reserv1_after).toContain(reservations[0]);
    expect(reserv2_after).toContain(reservations[1]);
  });
});
