import { prisma } from "@/db/prisma";

export const getTransactions = async () => {
  return await prisma.transaction.findMany({
    include: {
      employee: {
        select: {
          name: true,
          id: true,
        },
      },
      salaries: true,
      additions: true,
      deductions: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const createTransaction = async (data: any) => {
  return await prisma.transaction.create({
    data: {
      ...data,
      additions: {
        create: data.additions,
      },
      deductions: {
        create: data.deductions,
      },
    },
    include: {
      employee: true,
      additions: true,
      deductions: true,
    },
  });
};
