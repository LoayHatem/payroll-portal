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
}