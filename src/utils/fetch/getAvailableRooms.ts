import { Slot } from "@/types/dto/ReservationResponse";
import { reservFetch } from "./reservFetch";
import { convertFromDate } from "../date/convertFromDate";
import { RoomResponse } from "@/types/dto/RoomResponse";

export const getAvailableRooms = async (
  date: Date,
  slot: Slot,
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
