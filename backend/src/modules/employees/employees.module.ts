import { Router } from "express";
import { authenticateTokenMW } from "@/middlewares/authenticateToken.mw";
import { employeesController } from "./employees.controller";

export const employeesModule = () => {
  const router = Router();

  router.use("/", authenticateTokenMW, employeesController);

  return router;
};
