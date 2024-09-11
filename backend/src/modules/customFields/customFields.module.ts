import { Router } from "express";
import { authenticateTokenMW } from "@/middlewares/authenticateToken.mw";
import { customFieldsController } from "./customFields.controller";

export const customFieldsModule = () => {
  const router = Router();

  router.use("/", authenticateTokenMW, customFieldsController);

  return router;
};
