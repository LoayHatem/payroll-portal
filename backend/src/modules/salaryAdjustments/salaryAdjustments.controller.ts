import { Router } from "express";
import { getSalaryAdjustments, createSalaryAdjustment, updateSalaryAdjustment, deleteSalaryAdjustment } from "./salaryAdjustments.service";

export const salaryAdjustmentsController = Router();

salaryAdjustmentsController.get("/", async (req, res) => {
  const salaryAdjustments = await getSalaryAdjustments();
  return res.json({ salaryAdjustments });
});

salaryAdjustmentsController.post("/", async (req, res) => {
  const salaryAdjustment = await createSalaryAdjustment(req.body);
  return res.json({ salaryAdjustment });
});

salaryAdjustmentsController.put("/:id", async (req, res) => {
  const { id } = req.params;
  const salaryAdjustment = await updateSalaryAdjustment(id, req.body);
  return res.json({ salaryAdjustment });
});

salaryAdjustmentsController.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await deleteSalaryAdjustment(id);
  return res.json({ message: "Salary adjustment deleted successfully" });
});