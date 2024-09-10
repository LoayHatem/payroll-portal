import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

// Prisma error handling middleware
export function prismaErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.log("Prisma Error: ", err);
    res.status(500).json({ errorMessage: "A Server Has occurred." });
  } else {
    next(err);
  }
}
