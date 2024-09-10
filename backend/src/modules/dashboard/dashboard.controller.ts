import { Router } from "express";
import { getDashboardStats } from "./dashboard.service";

export const dashboardController = Router();

dashboardController.get("/stats", async (req, res) => {
  const userId = req.user.id;
  const stats = await getDashboardStats(userId);
  return res.json({ stats });
});
