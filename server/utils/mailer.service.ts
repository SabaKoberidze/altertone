import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST as string,
  port: process.env.MAIL_PORT as string,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.MAIL_USER as string,
    pass: process.env.MAIL_PASSWORD as string,
  },
});

export async function sendSuccessMail(mail: string, id: string) {
  try {
    const info = await transporter.sendMail({
      from: '"Altertone 🎙️" <maddison53@ethereal.email>',
      to: "",
      subject: "Altertone ჯავშანი",
      html: `<b>ჯავშნის ID : ${id}</b>`,
    });
  } catch (error) {
    throw new Error("Something went wrong");
  }
}
