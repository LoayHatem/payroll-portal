import { create } from "zustand";
import { api } from "../api/api";
import type { Employee } from "@/api/endpoints/employeeEndpoint";

interface EmployeeStore {
  employees: Employee[] | null;
  fetchEmployees: () => Promise<void>;
  addEmployee: (employee: Employee) => Promise<void>;
  updateEmployee: (id: string, employee: Employee) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
}

export const useEmployeeStore = create<EmployeeStore>((set) => ({
  employees: null,
  fetchEmployees: async () => {
    const { employees } = await api.employee.getEmployees();
    set({ employees });
  },
  addEmployee: async (employee) => {
    await api.employee.createEmployee(employee);
    set((state) => ({ employees: [...(state.employees || []), employee] }));
  },
  updateEmployee: async (id, employee) => {
    await api.employee.updateEmployee(id, employee);
    set((state) => ({
      employees: state.employees?.map((e) => (e.id === id ? employee : e)) || null,
    }));
  },
  deleteEmployee: async (id) => {
    await api.employee.deleteEmployee(id);
    set((state) => ({
      employees: state.employees?.filter((e) => e.id !== id) || null,
    }));
  },
}));