import express, { Express } from "express";
import cors from "cors";
import { appRouter } from "./app.modules";
import { wrapAsyncRoutes } from "./exceptions/routesErrorHandler";
import { prismaErrorHandler } from "./exceptions/prismaErrorHandler.";
import { uncaughtErrorHandler } from "./exceptions/uncaughtErrorHandler";
import { config } from "@/config";
import cookieParser from "cookie-parser";

const app: Express = express();
const port = config.apiPort;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors({ credentials: true, origin: [config.appUrl] }));
app.use(cookieParser());

// Order of middleware is important. do not change the order

// 1. Wrap all async appRouter modules with a try catch Error Handler
wrapAsyncRoutes(appRouter);

// 2. Register the appRouter modules
app.use("/api", appRouter);

// 3. Error handling middleware
app.use(prismaErrorHandler);
app.use(uncaughtErrorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
