import { describe, it, expect } from "vitest";
import { getMondayOfThisWeek } from "./getMondayOfThisWeek";
import { convertToDate } from "./convertToDate";

describe("getMondayOfThisWeek", () => {
  it("月曜日でない場合、その週の月曜日を返す", () => {
    // 連想配列を渡す
    const target_date = convertToDate("2023-10-25")._unsafeUnwrap();
    const result = getMondayOfThisWeek(target_date);
    const expected_date = convertToDate("2023-10-23")._unsafeUnwrap();
    expect(result).toEqual(expected_date);
  });
  it("土曜日であれば直後の月曜日を返す", () => {
    const target_date = convertToDate("2023-10-28")._unsafeUnwrap();
    const result = getMondayOfThisWeek(target_date);
    const expected_date = convertToDate("2023-10-30")._unsafeUnwrap();
    expect(result).toEqual(expected_date);
  });
  it("日曜日であれば直後の月曜日を返す", () => {
    const target_date = convertToDate("2023-10-29")._unsafeUnwrap();
    const result = getMondayOfThisWeek(target_date);
    const expected_date = convertToDate("2023-10-30")._unsafeUnwrap();
    expect(result).toEqual(expected_date);
  });
  it("月曜日であればその日を返す", () => {
    const target_date = convertToDate("2023-10-30")._unsafeUnwrap();
    const result = getMondayOfThisWeek(target_date);
    const expected_date = convertToDate("2023-10-30")._unsafeUnwrap();
    expect(result).toEqual(expected_date);
  });
});
