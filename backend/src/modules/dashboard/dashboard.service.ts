import { prisma } from "@/db/prisma";
import _ from "lodash";

export const getDashboardStats = async (userId: string) => {
  const totalEmployees = await prisma.employee.count();
  const totalSalaries = await prisma.salary.aggregate({
    _sum: { amount: true },
  });

  const monthlySalaries = await prisma.$queryRaw<Array<{ amount: number; month: string; year: number }>>`
    SELECT 
        strftime('%m',  DATETIME(ROUND(t.dueDate / 1000), 'unixepoch')) as month, 
        strftime('%Y',  DATETIME(ROUND(t.dueDate / 1000), 'unixepoch')) as year,
        SUM(t.amount) as amount
    FROM "Transaction" t
    GROUP BY month, year
    ORDER BY year DESC, month DESC
  `;

  const additionsByReason = await prisma.$queryRaw<Array<{ id: string; name: string; total_amount: number }>>`
    SELECT sa.id, sa.name, SUM(a.amount) as total_amount
    FROM SalaryAdjustment sa
    JOIN Addition a ON sa.id = a.reasonId
    GROUP BY sa.id, sa.name
    ORDER BY total_amount DESC
    LIMIT 10
  `;

  const deductionsByReason = await prisma.$queryRaw<Array<{ id: string; name: string; total_amount: number }>>`
    SELECT sa.id, sa.name, SUM(d.amount) as total_amount
    FROM SalaryAdjustment sa
    JOIN Deduction d ON sa.id = d.reasonId
    GROUP BY sa.id, sa.name
    ORDER BY total_amount DESC
    LIMIT 10
  `;

  const employeesByDepartment = await prisma.employee.groupBy({
    by: ["position"],
    _count: true,
    orderBy: { position: "desc" },
    take: 10, // Limit to top 10 departments
  });

  const totalAdditions = await prisma.addition.aggregate({
    _sum: { amount: true },
  });

  const totalDeductions = await prisma.deduction.aggregate({
    _sum: { amount: true },
  });

  const monthlyAdditions = await prisma.$queryRaw<Array<{ month: number; year: number; total_amount: number }>>`
    SELECT 
        strftime('%m',  DATETIME(ROUND(t.dueDate / 1000), 'unixepoch')) as month, 
        strftime('%Y',  DATETIME(ROUND(t.dueDate / 1000), 'unixepoch')) as year,
        a.amount as amount,
    SUM(a.amount) as total_amount
    FROM "Transaction" t
    JOIN Addition a ON t.id = a.transactionId
    GROUP BY month, year
    ORDER BY year DESC, month DESC
`;

  const monthlyDeductions = await prisma.$queryRaw<Array<{ month: number; year: number; total_amount: number }>>`
    SELECT 
        strftime('%m',  DATETIME(ROUND(t.dueDate / 1000), 'unixepoch')) as month, 
        strftime('%Y',  DATETIME(ROUND(t.dueDate / 1000), 'unixepoch')) as year,
        a.amount as amount,
        SUM(a.amount) as total_amount
    FROM "Transaction" t
    JOIN Deduction a ON t.id = a.transactionId
    GROUP BY month, year
    ORDER BY year DESC, month DESC
`;
  return {
    totalEmployees,
    totalSalaries: totalSalaries._sum.amount || 0,
    monthlySalaries,
    additionsByReason,
    deductionsByReason,
    employeesByDepartment,
    totalAdditions: totalAdditions._sum.amount || 0,
    totalDeductions: totalDeductions._sum.amount || 0,
    monthlyAdditions,
    monthlyDeductions,
  };
};
