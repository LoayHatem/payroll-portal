"use client";
import { useEffect, useState } from "react";
import EmployeesTable from "./EmployeesTable";
import EmployeeEditPanel from "./EmployeeEditPanel";
import { useEmployeeStore } from "@/stores/employeeStore";
import TableLoader from "@/components/core/TableLoader";
import { Employee } from "@/api/endpoints/employeeEndpoint";

export default function EmployeesModule() {
  const { fetchEmployees } = useEmployeeStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchEmployees().finally(() => setIsLoading(false));
  }, [fetchEmployees]);

  const openEditPanel = (employee: Employee) => {
    console.log("openEditPanel", employee);
    setSelectedEmployee(employee);
    setIsEditPanelOpen(true);
  };

  const closeEditPanel = () => {
    setIsEditPanelOpen(false);
    setSelectedEmployee(null);
  };

  return (
    <div className="max-h-screen h-screen overflow-hidden">
      {isLoading ? (
        <TableLoader rows={10} columns={5} />
      ) : (
        <EmployeesTable openEditPanel={openEditPanel} />
      )}
      {selectedEmployee && (
        <EmployeeEditPanel
          employee={selectedEmployee}
          isOpen={isEditPanelOpen}
          onClose={closeEditPanel}
        />
      )}
    </div>
  );
}
