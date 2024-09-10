import { NextFunction, Request, Response } from "express";

// Global error handling middleware
export function uncaughtErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.log("unhandled Error: ", err);
  if (err.name === "CustomError") {
    return res.status(400).json({ errorMessage: err.message });
  }
  res.status(500).json({ errorMessage: "A Server Has occurred." });
}
