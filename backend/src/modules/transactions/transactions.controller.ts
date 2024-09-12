import { Router } from "express";
import { getTransactions, createTransactions } from "./transactions.service";
import { z } from "zod";

export const transactionsController = Router();

const TransactionSchema = z.object({
  employeeId: z.string(),
  dueDate: z.string().datetime(),
  processDate: z.string().datetime(),
  amount: z.number(),
  isEndOfService: z.boolean(),
  additions: z.array(
    z.object({
      reasonId: z.string(),
      amount: z.number(),
    }),
  ),
  deductions: z.array(
    z.object({
      reasonId: z.string(),
      amount: z.number(),
    }),
  ),
  salaries: z.array(
    z.object({
      id: z.string(),
      amount: z.number(),
    }),
  ),
});

export type TransactionTransferObject = z.infer<typeof TransactionSchema>;

transactionsController.get("/", async (req, res) => {
  const transactions = await getTransactions();
  return res.json({ transactions });
});

transactionsController.post("/", async (req, res) => {
  const validatedData = z.array(TransactionSchema).parse(req.body);
  const transactions = await createTransactions(validatedData);
  return res.json({ transactions });
});
