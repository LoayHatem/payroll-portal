import { Router } from "express";
import { userModule } from "./modules/user/user.module";
import { authModule } from "./modules/auth/auth.module";
import { dashboardModule } from "./modules/dashboard/dashboard.module";

export const appRouter = Router();

appRouter.use("/user", userModule());
appRouter.use("/auth", authModule());
appRouter.use("/dashboard", dashboardModule());

