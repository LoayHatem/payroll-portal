import { prisma } from "@/db/prisma";

export const getEmployeesWithTotalSalary = async (userId: string) => {
  const employees = await prisma.employee.findMany({
    where: { userId },
    include: {
      salaries: {
        where: {
          type: {
            name: "Basic Salary",
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
      transactions: {
        include: {
          additions: true,
          deductions: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return employees.map((employee) => {
    const basicSalary = employee.salaries[0]?.amount || 0;
    const additions = employee.transactions[0]?.additions.reduce((sum, add) => sum + add.amount, 0) || 0;
    const deductions = employee.transactions[0]?.deductions.reduce((sum, ded) => sum + ded.amount, 0) || 0;
    const totalSalary = basicSalary + additions - deductions;

    return {
      ...employee,
      totalSalary,
    };
  });
};

export const getEmployees = async (userId: string) => {
  return await prisma.employee.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const createEmployee = async (userId: string, data: any) => {
  return await prisma.employee.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const updateEmployee = async (employeeId: string, data: any) => {
  return await prisma.employee.update({
    where: { id: employeeId },
    data,
  });
};

export const deleteEmployee = async (employeeId: string) => {
  return await prisma.employee.delete({
    where: { id: employeeId },
  });
};
