// import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { ja } from "date-fns/locale";

export function getFormatDateString(date: Date) {
  // x月y日(曜日)の形式で日付を返す
  //   return format(date, "M月d日(E)", { locale: ja });
  return formatInTimeZone(date, "Asia/Tokyo", "M月d日(E)", {
    locale: ja,
  });
}

export function getFormatDateStringWithTime(date: Date) {
  // x月y日(曜日) HH:mmの形式で日付を返す
  return formatInTimeZone(date, "Asia/Tokyo", "M月d日(E) HH:mm", {
    locale: ja,
  });
}

export function getFormatDateStringWithTimeInBrasil(date: Date) {
  // x月y日(曜日) HH:mmの形式で日付を返す
  return formatInTimeZone(date, "America/Sao_Paulo", "M月d日(E) HH:mm", {
    locale: ja,
  });
}
