import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_KEY);

export const sendMail = async (email: string, otp: string) => {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Verify your Account",
      html: `
        <p>We received a request to verify your account. Your One-Time Password (OTP) is:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; background-color: #edf2f7; border: 1px dashed #cbd5e0; border-radius: 6px; padding: 15px 30px;">
            <span style="font-family: 'Courier New', monospace; font-size: 28px; font-weight: bold; color: #3182ce; letter-spacing: 5px;">
              ${otp}
            </span>
          </div>
        </div>
        <p style="text-align: center;">This code will expire in 5 minutes.</p>
      `,
    });

    console.log("OTP email sent!");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};
