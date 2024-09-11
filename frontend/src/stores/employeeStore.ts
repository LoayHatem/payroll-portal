import { create } from "zustand";
import { api } from "../api/api";
import type { Employee, Salary, SalaryType } from "@/api/endpoints/employeeEndpoint";

interface EmployeeStore {
  employees: Employee[] | null;
  fetchEmployees: () => Promise<void>;
  addEmployee: (employee: Employee) => Promise<void>;
  updateEmployee: (id: string, employee: Employee) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  fetchEmployeeSalaries: (employeeId: string) => Promise<Salary[]>;
  addEmployeeSalary: (employeeId: string, salary: Salary) => Promise<Salary>;
  deleteEmployeeSalary: (employeeId: string, salaryId: string) => Promise<void>;
  fetchSalaryTypes: () => Promise<SalaryType[]>;
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
  fetchEmployeeSalaries: async (employeeId) => {
    const { salaries } = await api.employee.getEmployeeSalaries(employeeId);
    return salaries;
  },
  addEmployeeSalary: async (employeeId, salary) => {
    const { salary: newSalary } = await api.employee.addEmployeeSalary(employeeId, salary);
    return newSalary;
  },
  deleteEmployeeSalary: async (employeeId, salaryId) => {
    await api.employee.deleteEmployeeSalary(employeeId, salaryId);
  },
  fetchSalaryTypes: async () => {
    const { salaryTypes } = await api.employee.getSalaryTypes();
    return salaryTypes;
  },
}));