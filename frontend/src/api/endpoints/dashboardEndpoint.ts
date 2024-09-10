import { BaseEndpoint } from "./baseEndpoint";

export interface DashboardStats {
  totalEmployees: number;
  totalSalaries: number;
  monthlySalaries: { month: number; year: number; _sum: { value: number } }[];
  employeesByDepartment: { position: string; _count: number }[];
}

export class DashboardEndpoint extends BaseEndpoint {
  async getStats() {
    const res = await this.axios.get<{ stats: DashboardStats }>("/dashboard/stats");
    return res.data;
  }
}
