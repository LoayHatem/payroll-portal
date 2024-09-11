import { Router } from "express";
import { authenticateTokenMW } from "@/middlewares/authenticateToken.mw";
import { salaryAdjustmentsController } from "./salaryAdjustments.controller";

export const salaryAdjustmentsModule = () => {
  const router = Router();

  router.use("/", authenticateTokenMW, salaryAdjustmentsController);

  return router;
};
