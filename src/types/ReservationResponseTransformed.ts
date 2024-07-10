import { ReservationResponse } from "./ReservationResponse";

type TransformDate<T> = {
  [K in keyof T]: T[K] extends Date
    ? string
    : T[K] extends object
    ? TransformDate<T[K]>
    : T[K];
};

// 新しい型を定義します
export type ReservationResponseTransformed = TransformDate<ReservationResponse>;
