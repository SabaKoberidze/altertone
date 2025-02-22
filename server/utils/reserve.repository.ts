// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.SUPABASE_URL as string,
//   process.env.SUPABASE_KEY as string
// );

// interface ReservationData {
//   start_date: string;
//   end_date: string;
//   email: string;
//   name: string;
// }

// export type ReservationStatus =
//   | "created"
//   | "processing"
//   | "declined"
//   | "approved"
//   | "expired"
//   | "reversed";

// export async function selectTimesFromDatabase() {
//   try {
//     const currentDate = new Date().toISOString().split("T")[0];

//     const { data, error } = await supabase
//       .from("reservations")
//       .select("start_date, end_date")
//       .gte("end_date", `${currentDate}T00:00:00`);

//     if (error) {
//       throw error;
//     }

//     return data;
//   } catch (error) {
//     throw error;
//   }
// }

// export async function createReservation(reservationData: ReservationData) {
//   try {
//     const { data, error } = await supabase
//       .from("reservations")
//       .insert([reservationData])
//       .select();

//     if (error) {
//       throw error;
//     }

//     return data;
//   } catch (error) {
//     throw error;
//   }
// }

// export async function updateReservationStatus(
//   reservationId: number,
//   status: ReservationStatus
// ) {
//   try {
//     const { data, error } = await supabase
//       .from("reservations")
//       .update({ status })
//       .eq("id", reservationId)
//       .select();

//     if (error) {
//       throw error;
//     }

//     return data;
//   } catch (error) {
//     throw error;
//   }
// }
