import { Router } from "express";
import { getEmployeesWithTotalSalary, createEmployee, updateEmployee, deleteEmployee } from "./employees.service";

export const employeesController = Router();

employeesController.get("/", async (req, res) => {
  const userId = req.user.id;
  const employees = await getEmployeesWithTotalSalary(userId);
  return res.json({ employees });
});

employeesController.post("/", async (req, res) => {
  const userId = req.user.id;
  const employee = await createEmployee(userId, req.body);
  return res.json({ employee });
});

employeesController.put("/:id", async (req, res) => {
  const employeeId = req.params.id;
  const employee = await updateEmployee(employeeId, req.body);
  return res.json({ employee });
});

employeesController.delete("/:id", async (req, res) => {
  const employeeId = req.params.id;
  await deleteEmployee(employeeId);
  return res.sendStatus(204);
});
