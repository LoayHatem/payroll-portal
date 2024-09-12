import { create } from 'zustand';
import { api } from '../api/api';
import { SalaryAdjustment } from '@/api/endpoints/salaryAdjustmentEndpoint';

interface SalaryAdjustmentStore {
  salaryAdjustments: SalaryAdjustment[];
  fetchSalaryAdjustments: () => Promise<void>;
  createSalaryAdjustment: (adjustment: SalaryAdjustment) => Promise<void>;
  updateSalaryAdjustment: (id: string, adjustment: Partial<SalaryAdjustment>) => Promise<void>;
  deleteSalaryAdjustment: (id: string) => Promise<void>;
}

export const useSalaryAdjustmentStore = create<SalaryAdjustmentStore>((set) => ({
  salaryAdjustments: [],
  fetchSalaryAdjustments: async () => {
    const { salaryAdjustments } = await api.salaryAdjustment.getSalaryAdjustments();
    set({ salaryAdjustments });
  },
  createSalaryAdjustment: async (adjustment) => {
    const newAdjustment = await api.salaryAdjustment.createSalaryAdjustment(adjustment);
    set((state) => ({ salaryAdjustments: [...state.salaryAdjustments, newAdjustment] }));
  },
  updateSalaryAdjustment: async (id, adjustment) => {
    const updatedAdjustment = await api.salaryAdjustment.updateSalaryAdjustment(id, adjustment);
    set((state) => ({
      salaryAdjustments: state.salaryAdjustments.map((adj) =>
        adj.id === id ? updatedAdjustment : adj
      ),
    }));
  },
  deleteSalaryAdjustment: async (id) => {
    await api.salaryAdjustment.deleteSalaryAdjustment(id);
    set((state) => ({
      salaryAdjustments: state.salaryAdjustments.filter((adj) => adj.id !== id),
    }));
  },
}));