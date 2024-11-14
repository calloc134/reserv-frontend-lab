import { describe, it, expect } from "vitest";
import { getFormatDateString } from "./getFormatDateString";
import { convertToDate } from "./convertToDate";

describe("getFormatDateString", () => {
  it("任意の日付を指定した場合、x月y日(曜日)の形式で日付を返す", () => {
    const date = convertToDate("2024-10-15")._unsafeUnwrap();
    const formattedDate = getFormatDateString(date);
    expect(formattedDate).toBe("10月15日(火)");
  });
});
