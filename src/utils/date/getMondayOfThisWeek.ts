import { previousMonday, nextMonday, isWeekend, isMonday } from "date-fns";

export function getMondayOfThisWeek(date: Date): Date {
  // ここの判定部分ってタイムゾーン意識できてなくない？
  if (isWeekend(date)) {
    // 休日であるため、次の月曜日を取得
    return nextMonday(date);
  } else if (isMonday(date)) {
    // 月曜日であるため、そのまま返す
    return date;
  } else {
    // それ以外の曜日であるため、前の月曜日を取得
    return previousMonday(date);
  }
}
