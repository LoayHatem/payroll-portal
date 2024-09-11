import { create } from "zustand";
import { api } from "../api/api";
import type { CustomField, CustomFieldData } from "@/api/endpoints/customFieldEndpoint";

interface CustomFieldStore {
  customFields: CustomField[];
  fetchCustomFields: () => Promise<void>;
  createCustomField: (customField: Omit<CustomField, "id">) => Promise<void>;
  updateCustomField: (id: string, customField: Partial<CustomField>) => Promise<void>;
  deleteCustomField: (id: string) => Promise<void>;
  fetchEmployeeCustomFieldData: (employeeId: string) => Promise<CustomFieldData[]>;
  updateEmployeeCustomFieldData: (employeeId: string, customFieldId: string, value: string) => Promise<void>;
}

export const useCustomFieldStore = create<CustomFieldStore>((set) => ({
  customFields: [],
  fetchCustomFields: async () => {
    const { customFields } = await api.customField.getCustomFields();
    set({ customFields });
  },
  createCustomField: async (customField) => {
    const { customField: newCustomField } = await api.customField.createCustomField(customField);
    set((state) => ({ customFields: [...state.customFields, newCustomField] }));
  },
  updateCustomField: async (id, customField) => {
    const { customField: updatedCustomField } = await api.customField.updateCustomField(id, customField);
    set((state) => ({
      customFields: state.customFields.map((cf) => (cf.id === id ? updatedCustomField : cf)),
    }));
  },
  deleteCustomField: async (id) => {
    await api.customField.deleteCustomField(id);
    set((state) => ({
      customFields: state.customFields.filter((cf) => cf.id !== id),
    }));
  },
  fetchEmployeeCustomFieldData: async (employeeId) => {
    const { customFieldData } = await api.customField.getEmployeeCustomFieldData(employeeId);
    return customFieldData;
  },
  updateEmployeeCustomFieldData: async (employeeId, customFieldId, value) => {
    await api.customField.updateEmployeeCustomFieldData(employeeId, customFieldId, value);
  },
}));