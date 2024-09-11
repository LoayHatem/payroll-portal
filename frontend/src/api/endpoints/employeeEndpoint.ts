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
}