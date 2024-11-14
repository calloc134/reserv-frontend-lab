import { describe, it, expect } from "vitest";
import {
  convertFromDateInBrasil,
  convertFromDateInTokyo,
  convertFromDateInUTC,
} from "./convertFromDate";

describe("convertToDate", () => {
  it("有効なDateオブジェクトの場合はyyyy-MM-dd形式の文字列を返す", () => {
    // 東京において2024年10月1日のDateオブジェクトを生成
    // この場合、epoch時間は1727708400000となる
    const date = new Date(1727708400000);

    // 東京時間
    const tokyo_result = convertFromDateInTokyo(date);
    expect(tokyo_result).toBe("2024-10-01 00:00:00");

    // ブラジル時間
    // -3 -9 = -12
    const brasil_result = convertFromDateInBrasil(date);
    expect(brasil_result).toBe("2024-09-30 12:00:00");

    // UTC時間
    // +9
    const utc_result = convertFromDateInUTC(date);
    expect(utc_result).toBe("2024-09-30 15:00:00");
  });
});
