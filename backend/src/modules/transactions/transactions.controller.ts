import { Router } from "express";
import { getTransactions, createTransaction } from "./transactions.service";

export const transactionsController = Router();

transactionsController.get("/", async (req, res) => {
  const transactions = await getTransactions();
  return res.json({ transactions });
});

transactionsController.post("/", async (req, res) => {
  const transaction = await createTransaction(req.body);
  return res.json({ transaction });
});