import { describe, it, expect } from "vitest";
import { convertToDate, convertToDateInBrasil } from "./convertToDate";

describe("convertToDate", () => {
  it("有効な日付文字列の場合はDateオブジェクトを返す ブラジル", () => {
    const result = convertToDateInBrasil("2024-10-01");
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      // この場合、epoch時間は1727751600000となる
      expect(result.value.getTime()).toBe(1727751600000);
    }
  });

  it("有効な日付文字列の場合はDateオブジェクトを返す 東京", () => {
    const result = convertToDate("2024-10-01");
    expect(result.isOk()).toBe(true);
    if (result.isOk()) {
      // この場合、epoch時間は1727708400000となる
      expect(result.value.getTime()).toBe(1727708400000);
    }
  });

  it("無効な日付文字列の場合はエラーを返す フォーマットが違う", () => {
    const result = convertToDate("2024-10-1");
    expect(result.isOk()).toBe(false);
  });

  it("無効な日付文字列の場合はエラーを返す 1", () => {
    const result = convertToDate("invalid-date-string");
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe("Invalid date string");
    }
  });

  it("無効な日付文字列の場合はエラーを返す 2", () => {
    const result = convertToDate("");
    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe("Invalid date string");
    }
  });
});
