import React, { useEffect } from "react";
import { TotalEmployees } from "@/components/modules/dashboard/TotalEmployees";
import { TotalSalaries } from "@/components/modules/dashboard/TotalSalaries";
import { MonthlySalariesChart } from "@/components/modules/dashboard/MonthlySalariesChart";
import { EmployeesByDepartmentChart } from "@/components/modules/dashboard/EmployeesByDepartmentChart";
import { AdditionsByReasonChart } from "@/components/modules/dashboard/AdditionsByReasonChart";
import { MonthlyAdditionsDeductionsChart } from "@/components/modules/dashboard/MonthlyAdditionsDeductionsChart";
import { DeductionsByReasonChart } from "@/components/modules/dashboard/DeductionsByReasonChart";
import { TotalAdditionsDeductions } from "@/components/modules/dashboard/TotalAdditionsDeductions";
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
    <div className="chart-wrapper text-sm p-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <TotalEmployees count={stats.totalEmployees} />
          <TotalSalaries amount={stats.totalSalaries} />
          <TotalAdditionsDeductions
            additions={stats.totalAdditions}
            deductions={stats.totalDeductions}
          />
        </div>
        <MonthlySalariesChart data={stats.monthlySalaries} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <EmployeesByDepartmentChart data={stats.employeesByDepartment} />
          <MonthlyAdditionsDeductionsChart
            additions={stats.monthlyAdditions}
            deductions={stats.monthlyDeductions}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <AdditionsByReasonChart data={stats.additionsByReason} />
          <DeductionsByReasonChart data={stats.deductionsByReason} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
