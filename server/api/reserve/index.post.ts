import { sendSuccessMail } from "~/server/utils/mailer.service";
import { createReservation } from "~/server/utils/altertone.repository";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.start_date || !body.end_date || !body.email || !body.name) {
      throw new Error(
        "Missing required fields: start_date, end_date, email, name"
      );
    }
    const { start_date, end_date, email, name } = body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
    if (!isTimeslotValid(body.start_date, body.end_date)) {
      return {
        success: false,
        data: {},
      };
    }

    const reservation = await createReservation(body);
    //await sendSuccessMail("", reservation[0].id);

    return {
      success: true,
      data: {
        start_date,
        end_date,
        email,
        name,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
});
