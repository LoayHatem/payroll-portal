import { config } from "@/config";
import { sendEmail } from "./sendEmail.service";

export const sendConfirmationEmailWithCode = async (to: string, token: string): Promise<void> => {
  const confirmationUrl = `${config.appUrl}/confirm-email?token=${token}`;
  await sendEmail({
    to,
    subject: "Email Confirmation | PayrollPortal",
    templateName: "emailConfirmation",
    context: { url: confirmationUrl },
  });
};

export const sendConfirmationEmail = async (to: string, token: string, code: string): Promise<void> => {
  const confirmationUrl = `${config.appUrl}/confirm-email?token=${token}`;
  await sendEmail({
    to,
    subject: "Email Confirmation | PayrollPortal",
    templateName: "emailConfirmation",
    context: { url: confirmationUrl, code: code.split("") },
  });
};

export const sendForgotPasswordEmail = async (to: string, token: string): Promise<void> => {
  const resetUrl = `${config.appUrl}/reset-password?token=${token}`;
  await sendEmail({
    to,
    subject: "Password Reset Request | PayrollPortal",
    templateName: "forgotPassword",
    context: { url: resetUrl },
  });
};

export const sendWelcomeEmail = async (to: string, username: string): Promise<void> => {
  const profileUrl = `${config.appUrl}/profile`;
  await sendEmail({
    to,
    subject: "Welcome to PayrollPortal",
    templateName: "welcomeEmail",
    context: { url: profileUrl, username },
  });
};
