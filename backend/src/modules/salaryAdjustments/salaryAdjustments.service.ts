import { prisma } from "@/db/prisma";

export const getSalaryAdjustments = async () => {
  return await prisma.salaryAdjustment.findMany();
};

export const createSalaryAdjustment = async (data: any) => {
  return await prisma.salaryAdjustment.create({
    data,
  });
};