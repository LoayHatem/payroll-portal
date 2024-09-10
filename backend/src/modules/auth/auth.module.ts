import { Router } from "express";
import { authController } from "./auth.controller";

export const authModule = () => {
  const router = Router();

  router.use("/", authController);

  return router;
};
