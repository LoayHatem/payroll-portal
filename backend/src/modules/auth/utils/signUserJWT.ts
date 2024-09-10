import jwt from "jsonwebtoken";
import { config } from "@/config";

export const signUserJWT = (id: string, email: string) => {
  const token = jwt.sign({ id, email }, config.jwtSecret, { expiresIn: "90d" });
  return token;
};

export const signUserEmailJWT = (email: string) => {
  const token = jwt.sign({ email }, config.jwtSecret, { expiresIn: "1d" });
  return token;
};
