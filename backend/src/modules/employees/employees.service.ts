import { prisma } from "@/db/prisma";
import _ from "lodash";

export const getEmployeesWithTotalSalary = async () => {
  const employees = await prisma.employee.findMany({
    where: { deletedAt: null },
    include: {
      salaries: {
        select: {
          amount: true,
          id: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return employees.map((employee) => {
    const totalSalary = _.sumBy(employee.salaries, (salary) => salary.amount);

    return {
      ...employee,
      totalSalary,
    };
  });
};

export const getEmployees = async () => {
  return await prisma.employee.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const createEmployee = async (data: any) => {
  return await prisma.employee.create({
    data: {
      ...data,
    },
  });
};

export const updateEmployee = async (employeeId: string, data: any) => {
  return await prisma.employee.update({
    where: { id: employeeId },
    data: {
      name: data.name,
      email: data.email,
      position: data.position,
      joiningDate: data.joiningDate,
    },
  });
};

export const deleteEmployee = async (employeeId: string) => {
  return await prisma.employee.update({
    where: { id: employeeId },
    data: { deletedAt: new Date() },
  });
};

export const getEmployeeSalaries = async (employeeId: string) => {
  return await prisma.salary.findMany({
    where: { employeeId },
    include: { type: true },
    orderBy: { createdAt: "desc" },
  });
};

export const addEmployeeSalary = async (employeeId: string, data: any) => {
  return await prisma.salary.create({
    data: {
      amount: data.amount,
      month: data.month,
      year: data.year,
      employee: {
        connect: { id: employeeId },
      },
      type: {
        connect: { id: data.salaryTypeId },
      },
    },
    include: { type: true },
  });
};

export const deleteEmployeeSalary = async (employeeId: string, salaryId: string) => {
  return await prisma.salary.delete({
    where: { id: salaryId, employeeId },
  });
};

export const getSalaryTypes = async () => {
  return await prisma.salaryType.findMany({
    orderBy: { name: "asc" },
  });
};
