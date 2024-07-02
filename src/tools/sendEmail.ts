import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default function sendEmail(to: string, subject: string, text: string) {
  return new Promise<boolean | Error>((resolve) => {
    transporter.sendMail(
      {
        from: `"${process.env.EMAIL_NAME}" <${process.env.EMAIL_USER}>`,
        to: to,
        subject,
        text,
      },
      (err) => {
        if (err) {
          resolve(err);
        } else {
          resolve(true);
        }
      }
    );
  });
}
