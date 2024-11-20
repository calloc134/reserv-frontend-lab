import { Result, ok, err } from "neverthrow";
import { getMondayOfThisWeek } from "./getMondayOfThisWeek";
import { getToday } from "./getToday";
import { isValid } from "date-fns";

function convertStringToDate(dateString: string): Result<Date, string> {
  try {
    // これはDate型の内容がそのまま保存されていると考えられるので、タイムゾーンを考慮しない
    const date = new Date(dateString);
    if (isValid(date)) {
      return ok(date);
    }
    return err("Invalid date result");
  } catch (e) {
    return err("Invalid date string");
  }
}

export function validateDateString(search: Record<string, unknown>) {
  if (typeof search.start_date === "string") {
    const date_result = convertStringToDate(search.start_date);
    if (date_result.isOk()) {
      const monday = getMondayOfThisWeek(date_result.value);
      return {
        start_date: monday,
      };
    }
  }

  const today = getToday();
  const monday = getMondayOfThisWeek(today);
  return {
    start_date: monday,
  };
}
