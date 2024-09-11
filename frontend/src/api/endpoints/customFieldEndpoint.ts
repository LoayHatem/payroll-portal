import { BaseEndpoint } from "./baseEndpoint";

export interface CustomField {
  id: string;
  name: string;
  type: string;
}

export interface CustomFieldData {
  id: string;
  value: string;
  employeeId: string;
  customFieldId: string;
  customField: CustomField;
}

export class CustomFieldEndpoint extends BaseEndpoint {
  async getCustomFields() {
    const res = await this.axios.get<{ customFields: CustomField[] }>("/custom-fields");
    return res.data;
  }

  async createCustomField(customField: Omit<CustomField, "id">) {
    const res = await this.axios.post<{ customField: CustomField }>("/custom-fields", customField);
    return res.data;
  }

  async updateCustomField(id: string, customField: Partial<CustomField>) {
    const res = await this.axios.put<{ customField: CustomField }>(`/custom-fields/${id}`, customField);
    return res.data;
  }

  async deleteCustomField(id: string) {
    await this.axios.delete(`/custom-fields/${id}`);
  }

  async getEmployeeCustomFieldData(employeeId: string) {
    const res = await this.axios.get<{ customFieldData: CustomFieldData[] }>(`/custom-fields/employee/${employeeId}`);
    return res.data;
  }

  async updateEmployeeCustomFieldData(employeeId: string, customFieldId: string, value: string) {
    const res = await this.axios.post<{ customFieldData: CustomFieldData }>(`/custom-fields/employee/${employeeId}`, {
      customFieldId,
      value,
    });
    return res.data;
  }
}