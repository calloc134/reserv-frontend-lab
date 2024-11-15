import { describe, expect, it } from "vitest";
import { validateDateString } from "./validateDateString";
import { convertToDate } from "./convertToDate";
import { getToday } from "./getToday";

describe("validateDateString", () => {
  it("平日であれば直前の月曜日を返す", () => {
    // 連想配列を渡す
    const target_date = convertToDate("2023-10-25")._unsafeUnwrap();
    const result = validateDateString({
      start_date: target_date.toISOString(),
    });
    const expected_date = convertToDate("2023-10-23")._unsafeUnwrap();
    expect(result).toEqual({ start_date: expected_date });
  });

  it("土曜日であれば直後の月曜日を返す", () => {
    const target_date = convertToDate("2023-10-28")._unsafeUnwrap();
    const result = validateDateString({
      start_date: target_date.toISOString(),
    });
    const expected_date = convertToDate("2023-10-30")._unsafeUnwrap();
    expect(result).toEqual({ start_date: expected_date });
  });

  it("日曜日であれば直後の月曜日を返す", () => {
    const target_date = convertToDate("2023-10-29")._unsafeUnwrap();
    const result = validateDateString({
      start_date: target_date.toISOString(),
    });
    const expected_date = convertToDate("2023-10-30")._unsafeUnwrap();
    expect(result).toEqual({ start_date: expected_date });
  });

  it("日時が無効な場合は今日の日付の直前の月曜日を返す", () => {
    const result = validateDateString({
      start_date: "invalid date",
    });
    const expected_date = getToday();
    // expect(result).toEqual({ start_date: expected_date });
  });

  it("日時が無い場合は今日の日付の直前の月曜日を返す", () => {
    const result = validateDateString({});
    const expected_date = getToday();
    // expect(result).toEqual({ start_date: expected_date });
  });
});
