import dotenv from "dotenv";

dotenv.config();

export const config = {
  apiPort: (process.env.API_PORT || 3000) as number,
  databaseUrl: process.env.DATABASE_URL as string,
  jwtSecret: process.env.JWT_SECRET || "6e5e2537-5d42-478f-98aa-d155897b99d6",
  appUrl: process.env.APP_URL || "http://localhost:3000",
  apiUrl: process.env.API_URL || "http://localhost:3009",
  emailFrom: process.env.EMAIL_FROM || "noreply@example.com",
  sendGridApiKey: (process.env.SENDGRID_API_KEY || "") as string,
  emailService: process.env.EMAIL_SERVICE || "smtp",
  smtpHost: process.env.SMTP_HOST,
  smtpPort: (process.env.SMTP_PORT as any as number) || 587,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
};
