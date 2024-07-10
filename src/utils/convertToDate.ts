import { Result, ok, err } from "neverthrow";

export function convertToDate(date: string): Result<Date, Error> {
  // YYYY/MM/DD
  const [year, month, day] = date.split("-").map((x) => parseInt(x, 10));
  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return err(new Error("Invalid date"));
  }
  return ok(new Date(year, month - 1, day));
}
