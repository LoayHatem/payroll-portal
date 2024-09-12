import { prisma } from "@/db/prisma";
import { SalaryAdjustment } from "@prisma/client";

export const getSalaryAdjustments = async () => {
  return await prisma.salaryAdjustment.findMany();
};

export const createSalaryAdjustment = async (data: Omit<SalaryAdjustment, 'id' | 'createdAt' | 'updatedAt'>) => {
  return await prisma.salaryAdjustment.create({
    data,
  });
};

export const updateSalaryAdjustment = async (id: string, data: Partial<SalaryAdjustment>) => {
  return await prisma.salaryAdjustment.update({
    where: { id },
    data,
  });
};

export const deleteSalaryAdjustment = async (id: string) => {
  return await prisma.salaryAdjustment.delete({
    where: { id },
  });
};