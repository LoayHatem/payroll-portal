import { Router } from "express";
import {
  getCustomFields,
  createCustomField,
  updateCustomField,
  deleteCustomField,
  getEmployeeCustomFieldData,
  updateEmployeeCustomFieldData,
} from "./customFields.service";

export const customFieldsController = Router();

customFieldsController.get("/", async (req, res) => {
  const customFields = await getCustomFields();
  return res.json({ customFields });
});

customFieldsController.post("/", async (req, res) => {
  const customField = await createCustomField(req.body);
  return res.json({ customField });
});

customFieldsController.put("/:id", async (req, res) => {
  const customField = await updateCustomField(req.params.id, req.body);
  return res.json({ customField });
});

customFieldsController.delete("/:id", async (req, res) => {
  await deleteCustomField(req.params.id);
  return res.sendStatus(204);
});

customFieldsController.get("/employee/:employeeId", async (req, res) => {
  const customFieldData = await getEmployeeCustomFieldData(req.params.employeeId);
  return res.json({ customFieldData });
});

customFieldsController.post("/employee/:employeeId", async (req, res) => {
  const { customFieldId, value } = req.body;
  const customFieldData = await updateEmployeeCustomFieldData(req.params.employeeId, customFieldId, value);
  return res.json({ customFieldData });
});