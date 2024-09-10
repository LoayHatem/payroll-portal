import { Router } from "express";
import { userController } from "./user.controller";
import { authenticateTokenMW } from "@/middlewares/authenticateToken.mw";

export const userModule = () => {
  const router = Router();

  router.use("/", authenticateTokenMW, userController);

  return router;
};
