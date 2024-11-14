import { Result, ok, err } from "neverthrow";
import { fromZonedTime } from "date-fns-tz";

export function convertToDate(date_string: string): Result<Date, Error> {
  // 正規表現を用いてYYYY-MM-DD形式の文字列かどうかを判定する
  const date_regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!date_regex.test(date_string)) {
    return err(new Error("Invalid date string"));
  }

  const time_zone = "Asia/Tokyo";
  date_string = `${date_string}T00:00:00`;
  const utc_date = fromZonedTime(date_string, time_zone);

  return ok(utc_date);
}

export function convertToDateInBrasil(
  date_string: string
): Result<Date, Error> {
  // 正規表現を用いてYYYY-MM-DD形式の文字列かどうかを判定する
  const date_regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!date_regex.test(date_string)) {
    return err(new Error("Invalid date string"));
  }

  const time_zone = "America/Sao_Paulo";
  date_string = `${date_string}T00:00:00`;
  const utc_date = fromZonedTime(date_string, time_zone);

  return ok(utc_date);
}
