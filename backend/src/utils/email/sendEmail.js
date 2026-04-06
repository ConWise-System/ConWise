import nodemailer from "nodemailer";
import env from "../../config/env.js";

const host = process.env.EMAIL_HOST;
const port = process.env.EMAIL_PORT;
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  host: host,
  port: port,
  auth: {
    user: user,
    pass: pass,
  },
});

export const sendVerificationEmail = async (to, code) => {
  const mailOptions = {
    from: `"ConWise" <${user}>`,
    to,
    subject: "Verify your Company Account",
    html: `
      <h1>Welcome to ConWise!</h1>
      <p>Please use the following code to verify your account:</p>
      <h2 style="letter-spacing: 5px; color: #4A90E2;">${code}</h2>
      <p>This code expires in 10 minutes.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendStaffInviteEmail = async (
  recipientEmail,
  temporaryPassword,
) => {
  if (!recipientEmail) {
    throw new Error("sendStaffInviteEmail: No recipient email provided");
  }

  const mailOptions = {
    from: `"ConWise Team" <${user}>`,
    to: recipientEmail,
    subject: "You have been invited to join ConWise",
    html: `
      <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
        <h2>Welcome to the Team!</h2>
        <p>Your administrator has created an account for you on the ConWise platform.</p>
        <p>Please use the temporary password below to log in for the first time:</p>
        <div style="background: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px;">
          <h2 style="letter-spacing: 2px; color: #2563eb; margin: 0;">${temporaryPassword}</h2>
        </div>
        <p style="margin-top: 20px;">We recommend changing your password immediately after logging in.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <small>If you weren't expecting this invite, please ignore this email.</small>
      </div>
    `,
  };

  console.log("SENDING TO:", mailOptions.to); // Add this line to debug!
  return transporter.sendMail(mailOptions);
};
