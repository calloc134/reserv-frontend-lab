import { describe, it } from "vitest";
import { getToday } from "./getToday";
import { convertFromDateInTokyo } from "./convertFromDate";

describe("getToday", () => {
  it("should return today", () => {
    // Write your test here
    const result = getToday();
    const format_str = convertFromDateInTokyo(result);
    console.debug(format_str);
  });
});
