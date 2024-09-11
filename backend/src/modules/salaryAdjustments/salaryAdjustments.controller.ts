import { Router } from "express";
import { getSalaryAdjustments, createSalaryAdjustment } from "./salaryAdjustments.service";

export const salaryAdjustmentsController = Router();

salaryAdjustmentsController.get("/", async (req, res) => {
  const salaryAdjustments = await getSalaryAdjustments();
  return res.json({ salaryAdjustments });
});

salaryAdjustmentsController.post("/", async (req, res) => {
  const salaryAdjustment = await createSalaryAdjustment(req.body);
  return res.json({ salaryAdjustment });
});