export type ReservationResponse = {
  reservation_uuid: string;
  user: {
    user_id: string;
    name: string;
  } | null;
  room: {
    room_id: string;
    name: string;
  };
  slot: slot;
  date: Date;
};

export type slot = "first" | "second" | "third" | "fourth";

// numberに対応させる
export const slotToNumber = (slot: slot): number => {
  switch (slot) {
    case "first":
      return 1;
    case "second":
      return 2;
    case "third":
      return 3;
    case "fourth":
      return 4;
  }
};
