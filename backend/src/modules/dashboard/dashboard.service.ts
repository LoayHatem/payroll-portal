import { prisma } from "@/db/prisma";

export const getDashboardStats = async (userId: string) => {
  const totalEmployees = await prisma.employee.count();
  const totalSalaries = await prisma.salary.aggregate({
    _sum: { amount: true },
  });

  const monthlySalaries = await prisma.salary.groupBy({
    by: ['month', 'year'],
    _sum: { amount: true },
    orderBy: [{ year: 'asc' }, { month: 'asc' }],
    take: 12,
  });

  const employeesByDepartment = await prisma.employee.groupBy({
    by: ['position'],
    _count: true,
  });

  return {
    totalEmployees,
    totalSalaries: totalSalaries._sum.amount || 0,
    monthlySalaries,
    employeesByDepartment,
  };
};