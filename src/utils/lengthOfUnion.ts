// @ts-ig
type UnionToIntersection<U> = (U extends unknown ? (x: U) => unknown : never) extends (
  x: infer R
) => unknown
  ? R
  : never;

type LastOf<T> = UnionToIntersection<
  T extends unknown ? (x: T) => void : never
> extends (x: infer Last) => void
  ? Last
  : never;

type UnionToTuple<T, Last = LastOf<T>> = [T] extends [never]
  ? []
  : [...UnionToTuple<Exclude<T, Last>>, Last];

export type LengthOfUnion<T> = UnionToTuple<T>["length"];
