import { Router } from "express";
import { dashboardController } from "./dashboard.controller";
import { authenticateTokenMW } from "@/middlewares/authenticateToken.mw";

export const dashboardModule = () => {
  const router = Router();

  router.use("/", authenticateTokenMW, dashboardController);

  return router;
};