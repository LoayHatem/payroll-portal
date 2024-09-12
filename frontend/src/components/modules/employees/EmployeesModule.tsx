"use client";
import { useEffect, useState } from "react";
import EmployeesTable from "./EmployeesTable";
import EmployeeEditPanel from "./EmployeeEditPanel";
import AddEmployeePanel from "./AddEmployeePanel";
import { useEmployeeStore } from "@/stores/employeeStore";
import { Employee } from "@/api/endpoints/employeeEndpoint";

export default function EmployeesModule() {
  const { fetchEmployees } = useEmployeeStore();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const openEditPanel = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditPanelOpen(true);
  };

  const openAddPanel = () => {
    setIsAddPanelOpen(true);
  };

  const onEditPanelOpenChange = (value: boolean) => {
    setIsEditPanelOpen(value);
    if (!value) setSelectedEmployee(null);
  };

  const onAddPanelOpenChange = (value: boolean) => {
    setIsAddPanelOpen(value);
  };

  return (
    <div className="max-h-screen h-screen overflow-hidden">
      <EmployeesTable
        openEditPanel={openEditPanel}
        openAddPanel={openAddPanel}
      />
      {selectedEmployee && (
        <EmployeeEditPanel
          employee={selectedEmployee}
          isOpen={isEditPanelOpen}
          onOpenChange={onEditPanelOpenChange}
        />
      )}
      <AddEmployeePanel
        isOpen={isAddPanelOpen}
        onOpenChange={onAddPanelOpenChange}
      />
    </div>
  );
}
