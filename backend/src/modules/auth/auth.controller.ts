import { Router } from "express";
import {
  consumeEmailToken,
  createUser,
  createUserEmailToken,
  getEmailTokenByCode,
  getUserByEmail,
  getUserByEmailOrUserName,
  getUserEmailTokenByToken,
  getUserLastEmailToken,
  updateUserEmailVerified,
} from "./auth.service";
import _ from "lodash";
import { authenticateTokenMW } from "@/middlewares/authenticateToken.mw";
import { throwError } from "@/exceptions/throwError";
import { signUserEmailJWT, signUserJWT } from "./utils/signUserJWT";
import { comparePassword, encryptPassword } from "./utils/passwordUtils";
import { signUpDto } from "./dto/signup.dto";
import { sendConfirmationEmail, sendWelcomeEmail } from "../mail/emails.service";
import { generateEmailCode } from "@/utils/emailCode";

export const authController = Router();

// SIGNUP

authController.post("/signup", async (req, res) => {
  const { email, password } = signUpDto(req.body);
  const encryptedPassword = await encryptPassword(password);

  const userExist = await getUserByEmail(email);
  if (userExist) return throwError("Email already exists");

  const user = await createUser(email, encryptedPassword);

  const accessToken = signUserJWT(user.id, user.email);
  res.cookie("token", accessToken);

  const emailToken = signUserEmailJWT(user.email);
  const code = generateEmailCode(6);
  await sendConfirmationEmail(user.email, emailToken, code);
  await sendWelcomeEmail(user.email, user.username);
  await createUserEmailToken(user.id, emailToken, code);

  return res.json({ user: _.omit(user, "password") });
});

authController.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return throwError("Email and password are required");

  const user = await getUserByEmailOrUserName(email);
  const isMatch = user && (await comparePassword(password, user.password));
  if (!user || !isMatch) return throwError("Invalid email or password");

  const accessToken = signUserJWT(user.id, user.email);
  res.cookie("token", accessToken);

  return res.json({ user: _.omit(user, "password") });
});

authController.get("/validate-token", authenticateTokenMW, async (req, res) => {
  const userEmail = req.user?.email;
  if (!userEmail) return res.json(false);
  const user = await getUserByEmail(userEmail);
  return res.json({ valid: !!user, status: user?.status, emailVerified: user?.emailVerified });
});

authController.get("/logout", authenticateTokenMW, async (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logged out" });
});

authController.get("/resend-email-confirmation", authenticateTokenMW, async (req, res) => {
  const userLastEmailToken = await getUserLastEmailToken(req.user.id);
  // check if 5 min has passed since last email sent
  if (userLastEmailToken && userLastEmailToken.createdAt && userLastEmailToken.createdAt.getTime() + 5 * 60 * 1000 > Date.now()) {
    const remainingTime = Math.ceil((userLastEmailToken.createdAt.getTime() + 5 * 60 * 1000 - Date.now()) / 1000);
    return res.json({ success: false, message: `Email already sent, wait ${remainingTime} seconds`, remainingTime });
  }

  const emailToken = signUserEmailJWT(req.user.email);
  const code = generateEmailCode(6);
  await sendConfirmationEmail(req.user.email, emailToken, code);
  await createUserEmailToken(req.user.id, emailToken, code);

  return res.json({ success: true, message: `Email sent`, remainingTime: 300 });
});

authController.post("/confirm-email", async (req, res) => {
  const { token } = req.body;

  if (!token) return throwError("Token is required");

  const userToken = await getUserEmailTokenByToken(token as string);

  if (!userToken) return throwError("Invalid token");
  if (!userToken.userId) return throwError("Invalid token");

  await consumeEmailToken(userToken.id);
  await updateUserEmailVerified(userToken.userId);

  return res.json({ message: "Email verified" });
});

authController.post("/confirm-email-code", authenticateTokenMW, async (req, res) => {
  const { code } = req.body;

  if (!code) return throwError("Code is required");

  const userToken = await getEmailTokenByCode(req.user.id, code as string);

  if (!userToken) return throwError("Invalid code");
  if (!userToken.userId) return throwError("Invalid code");

  await consumeEmailToken(userToken.id);
  await updateUserEmailVerified(userToken.userId);

  return res.json({ message: "Email verified" });
});
