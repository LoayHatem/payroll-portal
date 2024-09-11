import { create } from 'zustand';
import { api } from '../api/api';
import { SalaryAdjustment } from '@/api/endpoints/salaryAdjustmentEndpoint';

interface SalaryAdjustmentStore {
  salaryAdjustments: SalaryAdjustment[];
  fetchSalaryAdjustments: () => Promise<void>;
}

export const useSalaryAdjustmentStore = create<SalaryAdjustmentStore>((set) => ({
  salaryAdjustments: [],
  fetchSalaryAdjustments: async () => {
    const { salaryAdjustments } = await api.salaryAdjustment.getSalaryAdjustments();
    set({ salaryAdjustments });
  },
}));