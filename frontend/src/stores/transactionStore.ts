import { create } from "zustand";
import { api } from "../api/api";
import type { Transaction } from "@/api/endpoints/transactionEndpoint";

interface TransactionStore {
  transactions: Transaction[] | null;
  fetchTransactions: () => Promise<void>;
  createTransaction: (transaction: Partial<Transaction>) => Promise<void>;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: null,
  fetchTransactions: async () => {
    const { transactions } = await api.transaction.getTransactions();
    set({ transactions });
  },
  createTransaction: async (transaction) => {
    const { transaction: newTransaction } = await api.transaction.createTransaction(transaction);
    set((state) => ({ transactions: [...(state.transactions || []), newTransaction] }));
  },
}));