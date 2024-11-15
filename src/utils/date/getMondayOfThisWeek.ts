import { previousMonday, nextMonday, isWeekend } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function getMondayOfThisWeek(date: Date): Date {
  if (isWeekend(toZonedTime(date, "Asia/Tokyo"))) {
    // 休日であるため、次の月曜日を取得
    return nextMonday(date);
  } else {
    // 平日であるため、直前の月曜日を取得
    return previousMonday(date);
  }
}
