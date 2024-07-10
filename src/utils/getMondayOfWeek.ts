export function getMondayOfThisWeek(today: Date = new Date()): Date {
  // まず本日の曜日を取得
  // 今日が平日であれば、前の月曜日から次の金曜日までの予約を取得
  // 今日が休日であれば、次の月曜日から金曜日までの予約を取得
  // 月曜さえ取得できれば、あとは+4日すれば金曜日になる

  const day = today.getDay();

  let start_date: Date;

  if (day === 0) {
    // 日曜日
    start_date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );
  } else if (day === 6) {
    // 土曜日
    start_date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 2
    );
  } else {
    // 平日であるため、月曜日を取得
    start_date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - day + 1
    );
  }

  return start_date;
}
