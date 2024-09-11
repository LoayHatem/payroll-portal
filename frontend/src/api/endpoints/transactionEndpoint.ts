import { BaseEndpoint } from "./baseEndpoint";
import { Employee } from "./employeeEndpoint";

export interface Addition {
  id: string;
  reasonId: string;
  amount: number;
  name: string;
}

export interface Deduction {
  id: string;
  reasonId: string;
  amount: number;
  name: string;
}

export interface Salary {
  id: string;
  amount: number;
}

export interface Transaction {
  id: string;
  employeeId: string;
  employee: Employee;
  processDate: string;
  salaries: Salary[];
  amount: number;
  additions: Addition[];
  deductions: Deduction[];
  isEndOfService: boolean;
}

export class TransactionEndpoint extends BaseEndpoint {
  async getTransactions() {
    const res = await this.axios.get<{ transactions: Transaction[] }>("/transactions");
    return res.data;
  }

  async createTransaction(transaction: Partial<Transaction>) {
    const res = await this.axios.post<{ transaction: Transaction }>("/transactions", transaction);
    return res.data;
  }
}
