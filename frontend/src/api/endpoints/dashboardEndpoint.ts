import { BaseEndpoint } from "./baseEndpoint";

export interface DashboardStats {
  totalEmployees: number;
  totalSalaries: number;
  monthlySalaries: { month: number; year: number; amount: number }[];
  additionsByReason: { id: string; name: string; total_amount: number }[];
  deductionsByReason: { id: string; name: string; total_amount: number }[];
  employeesByDepartment: { position: string; _count: number }[];
  totalAdditions: number;
  totalDeductions: number;
  monthlyAdditions: { month: number; year: number; total_amount: number }[];
  monthlyDeductions: { month: number; year: number; total_amount: number }[];
}

export class DashboardEndpoint extends BaseEndpoint {
  async getStats() {
    const res = await this.axios.get<{ stats: DashboardStats }>("/dashboard/stats");
    return res.data;
  }
}
