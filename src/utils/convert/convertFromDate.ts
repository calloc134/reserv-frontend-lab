import { toZonedTime } from "date-fns-tz";
import { format } from "date-fns";

export function convertFromDate(date: Date) {
  const time_zone = "Asia/Tokyo";
  const zoned_date = toZonedTime(date, time_zone);
  return format(zoned_date, "yyyy-MM-dd");
}

// タイムゾーンに依存していないことを確かめるためのテスト用関数 ブラジル
export function convertFromDateInBrasil(date: Date) {
  const time_zone = "America/Sao_Paulo";
  const zoned_date = toZonedTime(date, time_zone);
  return format(zoned_date, "yyyy-MM-dd HH:mm:ss");
}

// タイムゾーンに依存していないことを確かめるためのテスト用関数 東京
export function convertFromDateInTokyo(date: Date) {
  const time_zone = "Asia/Tokyo";
  const zoned_date = toZonedTime(date, time_zone);
  return format(zoned_date, "yyyy-MM-dd HH:mm:ss");
}

// タイムゾーンに依存していないことを確かめるためのテスト用関数 UTC
export function convertFromDateInUTC(date: Date) {
  const time_zone = "UTC";
  const zoned_date = toZonedTime(date, time_zone);
  return format(zoned_date, "yyyy-MM-dd HH:mm:ss");
}
