import { create } from "zustand";
import { api } from "../api/api";
import type { Transaction } from "@/api/endpoints/transactionEndpoint";

interface TransactionStore {
  transactions: Transaction[] | null;
  fetchTransactions: () => Promise<void>;
  createTransactions: (transaction: Partial<Transaction>[]) => Promise<Transaction[]>;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: null,
  fetchTransactions: async () => {
    const { transactions } = await api.transaction.getTransactions();
    set({ transactions });
  },
  createTransactions: async (transaction) => {
    const { transactions: newTransactions } = await api.transaction.createTransaction(transaction);
    set((state) => ({ transactions: [...(state.transactions || []), ...newTransactions] }));
    return newTransactions;
  },
}));