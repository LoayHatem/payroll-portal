import React, { useState, useEffect } from "react";
import { useEmployeeStore } from "@/stores/employeeStore";
import { Employee, Salary, SalaryType } from "@/api/endpoints/employeeEndpoint";
import SlideoutPanel from "@/components/core/SlideoutPanel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import SalariesTable from "./SalariesTable";
import { Separator } from "@/components/ui/separator"

interface EmployeeEditPanelProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

const EmployeeEditPanel: React.FC<EmployeeEditPanelProps> = ({ employee, isOpen, onClose }) => {
  const [editedEmployee, setEditedEmployee] = useState<Employee | null>(employee);
  const { updateEmployee, fetchEmployeeSalaries, addEmployeeSalary, deleteEmployeeSalary, fetchSalaryTypes } = useEmployeeStore();
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [salaryTypes, setSalaryTypes] = useState<SalaryType[]>([]);

  useEffect(() => {
    if (employee) {
      fetchEmployeeSalaries(employee.id).then(setSalaries);
      fetchSalaryTypes().then(setSalaryTypes);
    }
  }, [employee, fetchEmployeeSalaries, fetchSalaryTypes]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedEmployee) {
      setEditedEmployee({ ...editedEmployee, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedEmployee) {
      updateEmployee(editedEmployee.id, editedEmployee);
      onClose();
    }
  };

  const handleAddSalary = async (newSalary: Salary) => {
    if (editedEmployee) {
      const addedSalary = await addEmployeeSalary(editedEmployee.id, newSalary);
      console.log("addedSalary", addedSalary);
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

  if (!editedEmployee) return null;

  return (
    <SlideoutPanel
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Employee"
      description="Update employee information and manage salaries"
    >
      <div className="space-y-4 mt-4">
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
            value={editedEmployee.joiningDate}
            onChange={handleInputChange}
          />
        </div>

        <Button onClick={handleSubmit}>Save Changes</Button>

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

      </div>
    </SlideoutPanel>
  );
};

export default EmployeeEditPanel;
