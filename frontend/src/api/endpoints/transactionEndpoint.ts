import { BaseEndpoint } from "./baseEndpoint";
import { Employee } from "./employeeEndpoint";

export interface Addition {
  id: string;
  reasonId: string;
  amount: number;
  reason: {
    name: string;
  }
}

export interface Deduction {
  id: string;
  reasonId: string;
  amount: number;
  reason: {
    name: string;
  }
}

export interface Salary {
  id: string;
  amount: number;
  type: {
    name: string;
  }
}

export interface Transaction {
  id: string;
  employeeId: string;
  employee: Employee;
  processDate?: string;
  dueDate?: string;
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

  async createTransaction(transactions: Partial<Transaction>[]) {
    const res = await this.axios.post<{ transactions: Transaction[] }>("/transactions", transactions);
    return res.data;
  }
}
