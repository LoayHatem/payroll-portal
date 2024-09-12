import { BaseEndpoint } from './baseEndpoint';

export interface SalaryAdjustment {
  id: string;
  name: string;
  description?: string;
  type: 'addition' | 'deduction';
  amount: number;
  formula?: string;
  variables?: string;
  isEndOfService: boolean;
}

export class SalaryAdjustmentEndpoint extends BaseEndpoint {
  async getSalaryAdjustments() {
    const res = await this.axios.get<{ salaryAdjustments: SalaryAdjustment[] }>('/salary-adjustments');
    return res.data;
  }

  async createSalaryAdjustment(adjustment: Omit<SalaryAdjustment, 'id'>) {
    const res = await this.axios.post<{ salaryAdjustment: SalaryAdjustment }>('/salary-adjustments', adjustment);
    return res.data.salaryAdjustment;
  }

  async updateSalaryAdjustment(id: string, adjustment: Partial<SalaryAdjustment>) {
    const res = await this.axios.put<{ salaryAdjustment: SalaryAdjustment }>(`/salary-adjustments/${id}`, adjustment);
    return res.data.salaryAdjustment;
  }

  async deleteSalaryAdjustment(id: string) {
    await this.axios.delete(`/salary-adjustments/${id}`);
  }
}