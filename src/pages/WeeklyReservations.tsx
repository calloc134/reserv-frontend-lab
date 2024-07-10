import { useMemo } from "react";
import { createTable } from "../types/createTable";
import { useAuth } from "@clerk/clerk-react";
import { GetWeeklyReservationsHook } from "../hooks/GetWeeklyReservationsHook";

export const WeeklyReservations = () => {
  const { data, error } = GetWeeklyReservationsHook();

  console.debug(data, error);

  // 予約一覧を作成する
  // start_dateからend_dateまでの日付を表示
  // 時間割の形式となる
  // 時間割は平日のみ、コマは四限まで
  // 予約がある場合は、その予約を表示する

  const table_data = useMemo(() => {
    return createTable(data);
  }, [data]);

  const user = useAuth();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center">
        <h1 className="text-3xl font-bold text-gray-800">予約一覧(週)</h1>
      </div>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-8 xl:grid-cols-10 gap-4 w-full justify-center">
          {table_data.map((x) => {
            return (
              <div
                key={x.date.toString()}
                className="p-4 bg-white rounded-lg col-span-1 sm:col-span-2 md:col-span-2 border-2 border-black"
              >
                <div className="text-center text-lg font-semibold text-gray-700 mb-4">
                  {x.date.getMonth() + 1}月{x.date.getDate()}日 (
                  {["日", "月", "火", "水", "木", "金", "土"][x.date.getDay()]})
                </div>
                <div>
                  {x.reservations.map((y, i) => {
                    return (
                      <div key={i} className="py-2 border-b last:border-none">
                        {y ? (
                          <div className="text-gray-800 gap-2 flex items-center">
                            <span className="text-gray-600">{i + 1}限: </span>
                            {y.user?.user_id === user.userId ? (
                              <span className="font-medium text-blue-500">
                                {y.user?.name} (自分)
                              </span>
                            ) : (
                              <span className="font-medium">
                                {y.user?.name}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="text-gray-500">{i + 1}限: 空き</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
