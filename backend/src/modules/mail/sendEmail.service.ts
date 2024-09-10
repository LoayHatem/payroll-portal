import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";
import { compileTemplate } from "./emailTemplate.service";
import { config } from "@/config";
import _ from "lodash";

const emailService = config.emailService || "sendgrid";
const fromEmail = config.emailFrom || "noreply@example.com";

sgMail.setApiKey(config.sendGridApiKey || "");

interface IEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  context: {
    username?: string;
    url: string;
    code?: string[];
  };
}

const sendEmailSMTP = async (options: IEmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: _.toNumber(config.smtpPort),
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  });

  const htmlContent = await compileTemplate(options.templateName, options.context);

  const mailOptions = {
    from: fromEmail,
    to: options.to,
    subject: options.subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

const sendEmailSendGrid = async (options: IEmailOptions): Promise<void> => {
  const htmlContent = await compileTemplate(options.templateName, options.context);

  const msg = {
    to: options.to,
    from: fromEmail,
    subject: options.subject,
    html: htmlContent,
  };

  await sgMail.send(msg);
};

export const sendEmail = async (options: IEmailOptions): Promise<void> => {
  if (emailService === "smtp") {
    await sendEmailSMTP(options);
  } else {
    await sendEmailSendGrid(options);
  }
};
