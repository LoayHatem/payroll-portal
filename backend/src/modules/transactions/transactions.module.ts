import { Router } from "express";
import { authenticateTokenMW } from "@/middlewares/authenticateToken.mw";
import { transactionsController } from "./transactions.controller";

export const transactionsModule = () => {
  const router = Router();

  router.use("/", authenticateTokenMW, transactionsController);

  return router;
};