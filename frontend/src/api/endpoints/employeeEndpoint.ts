import { BaseEndpoint } from "./baseEndpoint";

export interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  joiningDate: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  totalSalary: number;
}

export interface Salary {
  id: string;
  month: number;
  year: number;
  amount: number;
  salaryTypeId: string;
  type: {
    id: string;
    name: string;
  };
}

export interface SalaryType {
  id: string;
  name: string;
}

export class EmployeeEndpoint extends BaseEndpoint {
  async getEmployees() {
    const res = await this.axios.get<{ employees: Employee[] }>("/employees");
    return res.data;
  }

  async createEmployee(employee: Employee) {
    const res = await this.axios.post<{ employee: Employee }>("/employees", employee);
    return res.data;
  }

  async updateEmployee(id: string, employee: Employee) {
    const res = await this.axios.put<{ employee: Employee }>(`/employees/${id}`, employee);
    return res.data;
  }

  async deleteEmployee(id: string) {
    await this.axios.delete(`/employees/${id}`);
  }

  async getEmployeeSalaries(employeeId: string) {
    const res = await this.axios.get<{ salaries: Salary[] }>(`/employees/${employeeId}/salaries`);
    return res.data;
  }

  async addEmployeeSalary(employeeId: string, salary: Salary) {
    const res = await this.axios.post<{ salary: Salary }>(`/employees/${employeeId}/salaries`, salary);
    return res.data;
  }

  async deleteEmployeeSalary(employeeId: string, salaryId: string) {
    await this.axios.delete(`/employees/${employeeId}/salaries/${salaryId}`);
  }

  async getSalaryTypes() {
    const res = await this.axios.get<{ salaryTypes: SalaryType[] }>("/employees/salary-types");
    return res.data;
  }
}