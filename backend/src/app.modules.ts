import { Router } from "express";
import { userModule } from "./modules/user/user.module";
import { authModule } from "./modules/auth/auth.module";
import { dashboardModule } from "./modules/dashboard/dashboard.module";
import { employeesModule } from "./modules/employees/employees.module";
import { customFieldsModule } from "./modules/customFields/customFields.module";
import { transactionsModule } from "./modules/transactions/transactions.module";
import { salaryAdjustmentsModule } from "./modules/salaryAdjustments/salaryAdjustments.module";

export const appRouter = Router();

appRouter.use("/user", userModule());
appRouter.use("/auth", authModule());
appRouter.use("/dashboard", dashboardModule());
appRouter.use("/employees", employeesModule());
appRouter.use("/custom-fields", customFieldsModule());
appRouter.use("/transactions", transactionsModule());
appRouter.use("/salary-adjustments", salaryAdjustmentsModule());
