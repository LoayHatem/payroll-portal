import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { TUserPayload } from "../types/auth.types";
import { config } from "@/config";
import _ from "lodash";
import prisma from "@/db/prisma";

const JWT_SECRET = config.jwtSecret;

// Middleware to validate JWT token
export const authenticateTokenMW = (req: Request, res: Response, next: NextFunction) => {
  const cookie = req.cookies["token"] as string;
  if (!_.isString(cookie)) return res.sendStatus(401);

  const token = cookie;

  jwt.verify(token, JWT_SECRET, async (err, decoded: any) => {
    if (err) return res.sendStatus(403);
    // Ensure the decoded object is of type UserPayload
    const user = decoded as TUserPayload;
    const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { id: true, email: true } });
    if (!dbUser) {
      res.clearCookie("token");
      return res.sendStatus(403);
    }
    // Attach the user payload to the request object
    (req as any).user = dbUser;
    next();
  });
};
