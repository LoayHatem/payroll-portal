import React, { useState, useEffect } from "react";
import { useEmployeeStore } from "@/stores/employeeStore";
import { useCustomFieldStore } from "@/stores/customFieldStore";
import { Employee, Salary, SalaryType } from "@/api/endpoints/employeeEndpoint";
import { CustomFieldData } from "@/api/endpoints/customFieldEndpoint";
import SlideoutPanel from "@/components/core/SlideoutPanel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import SalariesTable from "./SalariesTable";
import { Separator } from "@/components/ui/separator";

interface EmployeeEditPanelProps {
  employee: Employee | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmployeeEditPanel: React.FC<EmployeeEditPanelProps> = ({ employee, isOpen, onOpenChange }) => {
  const [editedEmployee, setEditedEmployee] = useState<Employee | null>(employee);
  const { updateEmployee, fetchEmployeeSalaries, addEmployeeSalary, deleteEmployeeSalary, fetchSalaryTypes } = useEmployeeStore();
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [salaryTypes, setSalaryTypes] = useState<SalaryType[]>([]);
  const { customFields, fetchCustomFields, fetchEmployeeCustomFieldData, updateEmployeeCustomFieldData } = useCustomFieldStore();
  const [customFieldData, setCustomFieldData] = useState<CustomFieldData[]>([]);

  useEffect(() => {
    if (employee) {
      fetchEmployeeSalaries(employee.id).then(setSalaries);
      fetchSalaryTypes().then(setSalaryTypes);
      fetchCustomFields();
      fetchEmployeeCustomFieldData(employee.id).then(setCustomFieldData);
    }
  }, [employee, fetchEmployeeSalaries, fetchSalaryTypes, fetchCustomFields, fetchEmployeeCustomFieldData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedEmployee) {
      setEditedEmployee({ ...editedEmployee, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedEmployee) {
      updateEmployee(editedEmployee.id, editedEmployee);
      onOpenChange(false);
    }
    handleSaveCustomFields()
  };

  const handleAddSalary = async (newSalary: Salary) => {
    if (editedEmployee) {
      const addedSalary = await addEmployeeSalary(editedEmployee.id, newSalary);
      if (addedSalary) {
        setSalaries([...salaries, addedSalary]);
      }
    }
  };

  const handleDeleteSalary = async (salaryId: string) => {
    if (editedEmployee) {
      await deleteEmployeeSalary(editedEmployee.id, salaryId);
      setSalaries(salaries.filter((salary) => salary.id !== salaryId));
    }
  };

  const handleCustomFieldChange = (customFieldId: string, value: string) => {
    const existingDataIndex = customFieldData.findIndex((data) => data.customFieldId === customFieldId);
    if (existingDataIndex !== -1) {
      const updatedData = [...customFieldData];
      updatedData[existingDataIndex] = { ...updatedData[existingDataIndex], value };
      setCustomFieldData(updatedData);
    } else {
      setCustomFieldData([
        ...customFieldData,
        {
          customFieldId,
          value,
          employeeId: employee!.id,
          customField: customFields.find((field) => field.id === customFieldId)!,
          id: "",
        },
      ]);
    }
  };

  const handleSaveCustomFields = async () => {
    for (const data of customFieldData) {
      await updateEmployeeCustomFieldData(employee!.id, data.customFieldId, data.value);
    }
  };

  if (!editedEmployee) return null;

  return (
    <SlideoutPanel
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Edit Employee"
      description="Update employee information and manage salaries"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4 mt-4"
      >
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={editedEmployee.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={editedEmployee.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            name="position"
            value={editedEmployee.position}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="joiningDate">Joining Date</Label>
          <Input
            id="joiningDate"
            name="joiningDate"
            type="date"
            value={editedEmployee.joiningDate ? new Date(editedEmployee.joiningDate).toISOString().split("T")[0] : ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Custom Fields</h3>
          {customFields &&
            customFields.map((field) => (
              <div
                key={field.id}
                className="mb-2"
              >
                <Label htmlFor={`custom-${field.id}`}>{field.name}</Label>
                <Input
                  id={`custom-${field.id}`}
                  type={field.type}
                  value={customFieldData.find((data) => data.customFieldId === field.id)?.value || ""}
                  onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                />
              </div>
            ))}

          <Button onClick={handleSubmit}>Save Changes</Button>
        </div>

        <Separator />

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Salaries and Allowances</h3>
          <SalariesTable
            salaries={salaries}
            salaryTypes={salaryTypes}
            onAddSalary={handleAddSalary}
            onDeleteSalary={handleDeleteSalary}
          />
        </div>
      </form>
    </SlideoutPanel>
  );
};

export default EmployeeEditPanel;
