import { slot } from "@/types/ReservationResponse";
import { reservFetch } from "./reservFetch";
import { convertFromDate } from "./convertFromDate";
import { RoomResponse } from "@/types/RoomResponse";

export const getAvailableRooms = async (
  date: Date,
  slot: slot,
  token: string | null
) => {
  const raw_date = convertFromDate(date);

  const res = (await reservFetch(
    `/rooms/available/date/${raw_date}/slot/${slot}/`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )) as { status: number; data: RoomResponse[] };

  if (res.status !== 200) {
    throw new Error("Error fetching available rooms");
  }

  return res.data;
};
