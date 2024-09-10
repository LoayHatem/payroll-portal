import React, { useEffect } from "react";
import { TotalEmployees } from "@/components/modules/dashboard/TotalEmployees";
import { TotalSalaries } from "@/components/modules/dashboard/TotalSalaries";
import { MonthlySalariesChart } from "@/components/modules/dashboard/MonthlySalariesChart";
import { EmployeesByDepartmentChart } from "@/components/modules/dashboard/EmployeesByDepartmentChart";
import { useDashboardStore } from "@/stores/dashboardStore";

export const Dashboard: React.FC = () => {
  const { stats, fetchStats } = useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <TotalEmployees count={stats.totalEmployees} />
        <TotalSalaries amount={stats.totalSalaries} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <MonthlySalariesChart data={stats.monthlySalaries} />
        <EmployeesByDepartmentChart data={stats.employeesByDepartment} />
      </div>
    </div>
  );
};

export default Dashboard;
