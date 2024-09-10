import { Router } from "express";
import { userModule } from "./modules/user/user.module";
import { authModule } from "./modules/auth/auth.module";

export const appRouter = Router();

appRouter.use("/user", userModule());
appRouter.use("/auth", authModule());

