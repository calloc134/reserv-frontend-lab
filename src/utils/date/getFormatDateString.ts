import { format } from "date-fns";
import { ja } from "date-fns/locale";

export function getFormatDateString(date: Date) {
  // x月y日(曜日)の形式で日付を返す
  return format(date, "M月d日(E)", { locale: ja });
}
