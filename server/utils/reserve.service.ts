export function isTimeslotValid(start_date: string, end_date: string): boolean {
  const timeslots = [
    { start: "10:00", end: "12:00" },
    { start: "12:00", end: "14:00" },
    { start: "14:00", end: "16:00" },
    { start: "16:00", end: "18:00" },
    { start: "18:00", end: "20:00" },
    { start: "20:00", end: "22:00" },
  ];

  try {
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (isNaN(startDate.getTime()))
      throw new Error("Invalid start_date format.");
    if (isNaN(endDate.getTime())) throw new Error("Invalid end_date format.");

    const startDay = startDate.toISOString().split("T")[0];
    const endDay = endDate.toISOString().split("T")[0];
    if (startDay !== endDay) {
      throw new Error("start_date and end_date must be on the same day.");
    }

    const today = new Date();
    const oneMonthFromToday = new Date();
    oneMonthFromToday.setMonth(today.getMonth() + 1);

    if (startDate < today || startDate > oneMonthFromToday) {
      throw new Error("start_date must be within 1 month from today.");
    }
    if (endDate < today || endDate > oneMonthFromToday) {
      throw new Error("end_date must be within 1 month from today.");
    }

    const startTime = startDate.toISOString().split("T")[1].substring(0, 5);
    const endTime = endDate.toISOString().split("T")[1].substring(0, 5);

    return timeslots.some(
      (slot) => slot.start === startTime && slot.end === endTime
    );
  } catch (error) {
    console.error("Error validating timeslot:", error);
    return false;
  }
}

export async function getReserveTimes() {
  try {
    const reservations = await selectTimesFromDatabase();
    const reservedSlotsByDay: { [key: string]: string[] } = {};

    reservations.forEach((reservation) => {
      const start = new Date(reservation.start_date);
      const end = new Date(reservation.end_date);

      const dateKey = start.toISOString().split("T")[0];

      if (!reservedSlotsByDay[dateKey]) {
        reservedSlotsByDay[dateKey] = [];
      }

      const startTime = start.toISOString().split("T")[1].substring(0, 5); // "HH:mm"
      const endTime = end.toISOString().split("T")[1].substring(0, 5); // "HH:mm"
      reservedSlotsByDay[dateKey].push(`${startTime}-${endTime}`);
    });

    const result = Object.keys(reservedSlotsByDay).map((dateKey) => ({
      day: dateKey,
      reserved: reservedSlotsByDay[dateKey],
    }));

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error fetching reserved timeslots:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
