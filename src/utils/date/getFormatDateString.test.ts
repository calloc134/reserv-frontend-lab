import { describe, it, expect } from "vitest";
import {
  getFormatDateString,
  getFormatDateStringWithTime,
  getFormatDateStringWithTimeInBrasil,
} from "./getFormatDateString";
import { convertToDate } from "./convertToDate";

describe("getFormatDateString", () => {
  it("任意の日付を指定した場合、x月y日(曜日)の形式で日付を返す", () => {
    const date = convertToDate("2024-10-15")._unsafeUnwrap();
    const formattedDate = getFormatDateString(date);
    expect(formattedDate).toBe("10月15日(火)");
  });
  it("任意の日付を指定した場合、x月y日(曜日) HH:mmの形式で日付を返す", () => {
    const date = new Date(1727708400000);
    const formattedDate = getFormatDateStringWithTime(date);
    expect(formattedDate).toBe("10月1日(火) 00:00");
  });
  it("任意の日付を指定した場合、x月y日(曜日) HH:mmの形式で日付を返す ブラジル時間", () => {
    // この場合、epoch時間は1727751600000となる
    const date = new Date(1727751600000);
    const formattedDate = getFormatDateStringWithTimeInBrasil(date);
    expect(formattedDate).toBe("10月1日(火) 00:00");
  });
});
