import React, { useState } from "react";
import { useEmployeeStore } from "@/stores/employeeStore";
import { Employee } from "@/api/endpoints/employeeEndpoint";
import SlideoutPanel from "@/components/core/SlideoutPanel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface AddEmployeePanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddEmployeePanel: React.FC<AddEmployeePanelProps> = ({ isOpen, onOpenChange }) => {
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({});
  const { addEmployee } = useEmployeeStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "joiningDate") {
      setNewEmployee({ ...newEmployee, [name]: new Date(value).toISOString() });
    } else {
      setNewEmployee({ ...newEmployee, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmployee.name && newEmployee.email) {
      await addEmployee(newEmployee as Employee);
      onOpenChange(false);
      setNewEmployee({});
    }
  };

  return (
    <SlideoutPanel
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Add New Employee"
      description="Enter new employee information"
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={newEmployee.name || ""}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={newEmployee.email || ""}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            name="position"
            value={newEmployee.position || ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="joiningDate">Joining Date</Label>
          <Input
            id="joiningDate"
            name="joiningDate"
            type="date"
            value={newEmployee.joiningDate ? new Date(newEmployee.joiningDate).toISOString().split("T")[0] : ""}
            onChange={handleInputChange}
          />
        </div>

        <Button type="submit">Add Employee</Button>
      </form>
    </SlideoutPanel>
  );
};

export default AddEmployeePanel;