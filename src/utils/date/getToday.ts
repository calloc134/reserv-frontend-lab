import { startOfDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function getToday() {
  const time_zone = "Asia/Tokyo";
  const today = startOfDay(new Date());
  return toZonedTime(today, time_zone);
}
