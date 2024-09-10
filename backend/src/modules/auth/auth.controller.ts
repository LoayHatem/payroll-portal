import { Router } from "express";
import { createUser, getUserByEmail } from "./auth.service";
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
  const { email, password, name } = signUpDto(req.body);
  const encryptedPassword = await encryptPassword(password);

  const userExist = await getUserByEmail(email);
  if (userExist) return throwError("Email already exists");

  const user = await createUser(email, encryptedPassword, name);

  const accessToken = signUserJWT(user.id, user.email);
  res.cookie("token", accessToken);

  const emailToken = signUserEmailJWT(user.email);
  const code = generateEmailCode(6);
  await sendConfirmationEmail(user.email, emailToken, code);
  await sendWelcomeEmail(user.email, user.name);

  return res.json({ user: _.omit(user, "password") });
});

authController.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return throwError("Email and password are required");

  const user = await getUserByEmail(email);
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
  return res.json({ valid: !!user });
});

authController.get("/logout", authenticateTokenMW, async (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logged out" });
});
