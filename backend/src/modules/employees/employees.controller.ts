import { Router } from "express";
import {
  getEmployeesWithTotalSalary,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeSalaries,
  addEmployeeSalary,
  deleteEmployeeSalary,
  getSalaryTypes,
} from "./employees.service";
import _ from "lodash";

export const employeesController = Router();

employeesController.get("/", async (req, res) => {
  const userId = req.user.id;
  const employees = await getEmployeesWithTotalSalary();
  return res.json({ employees });
});

employeesController.post("/", async (req, res) => {
  const userId = req.user.id;
  const employee = await createEmployee(req.body);
  return res.json({ employee });
});

employeesController.put("/:id", async (req, res) => {
  const employeeId = req.params.id;
  // extract correct user data from the body
  const employee = await updateEmployee(employeeId, req.body);
  return res.json({ employee });
});

employeesController.delete("/:id", async (req, res) => {
  const employeeId = req.params.id;
  await deleteEmployee(employeeId);
  return res.sendStatus(204);
});

employeesController.get("/:id/salaries", async (req, res) => {
  const employeeId = req.params.id;
  const salaries = await getEmployeeSalaries(employeeId);
  return res.json({ salaries });
});

employeesController.post("/:id/salaries", async (req, res) => {
  const employeeId = req.params.id;
  const data = {
    amount: _.toInteger(req.body.amount),
    month: _.toInteger(req.body.month),
    year: _.toInteger(req.body.year),
    salaryTypeId: req.body.salaryTypeId,
  };
  const salary = await addEmployeeSalary(employeeId, data);
  return res.json({ salary });
});

employeesController.delete("/:employeeId/salaries/:salaryId", async (req, res) => {
  const { employeeId, salaryId } = req.params;
  await deleteEmployeeSalary(employeeId, salaryId);
  return res.sendStatus(204);
});

employeesController.get("/salary-types", async (req, res) => {
  const salaryTypes = await getSalaryTypes();
  return res.json({ salaryTypes });
});
