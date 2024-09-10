import { Request, Response, NextFunction } from "express";
import _ from "lodash";
import prisma from "@/db/prisma";
import { verifyAdminJWT } from "@/modules/auth/utils/signAdminJWT";

// Middleware to validate JWT token
export const authenticateAdminTokenMW = async (req: Request, res: Response, next: NextFunction) => {
  const cookie = req.cookies["adminToken"] as string;
  if (!_.isString(cookie)) return res.sendStatus(401);

  const token = cookie;
  const jwtResult = await verifyAdminJWT(token);
  const dbAdmin = await prisma.admin.findUnique({ where: { id: jwtResult.id }, select: { id: true, email: true, isSa: true } });
  if (!dbAdmin) {
    // res.clearCookie("adminToken");
    return res.sendStatus(403);
  }
  // Attach the user payload to the request object
  (req as any).admin = dbAdmin;
  next();
};
