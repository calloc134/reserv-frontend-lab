import { Result, ok, err } from "neverthrow";
import { type LengthOfUnion } from "@/utils/lengthOfUnion";

export type ReservationResponse = {
  rord_uuid: string;
  user: {
    user_id: string;
    name: string;
  } | null;
  room: {
    room_id: string;
    name: string;
  };
  slot: Slot;
  date: Date;
};

export type Slot = "first" | "second" | "third" | "fourth" | "fifth";

type SlotLength = LengthOfUnion<Slot>;

export const slot_length: SlotLength = 5 as const;

// numberに対応させる
export const slotToNumber = (slot: Slot): number => {
  switch (slot) {
    case "first":
      return 1;
    case "second":
      return 2;
    case "third":
      return 3;
    case "fourth":
      return 4;
    case "fifth":
      return 5;
  }
};

export const numberToSlot = (num: number): Result<Slot, Error> => {
  switch (num) {
    case 1:
      return ok("first");
    case 2:
      return ok("second");
    case 3:
      return ok("third");
    case 4:
      return ok("fourth");
    case 5:
      return ok("fifth");
  }

  return err(new Error("Invalid number"));
};
