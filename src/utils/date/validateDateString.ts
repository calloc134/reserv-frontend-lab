import { Result, ok, err } from "neverthrow";
import { getMondayOfThisWeek } from "../getMondayOfThisWeek";

function convertStringToDate(dateString: string): Result<Date, string> {
  try {
    const date = new Date(dateString);
    return ok(date);
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

  const today = new Date();
  const monday = getMondayOfThisWeek(today);
  return {
    start_date: monday,
  };
}
