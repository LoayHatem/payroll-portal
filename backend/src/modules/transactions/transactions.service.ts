import { prisma } from "@/db/prisma";
import { TransactionTransferObject } from "./transactions.controller";

export const getTransactions = async () => {
  return await prisma.transaction.findMany({
    include: {
      employee: {
        select: {
          name: true,
          id: true,
        },
      },
      salaries: {
        include: {
          type : {
            select :{
              name : true,
            }
          }
        }
      },
      additions: {
        include: {
          reason: {
            select: {
              name: true,
            },
          },
        },  
      },
      deductions: {
        include: {
          reason: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const createTransactions = async (data: TransactionTransferObject[]) => {
  return await prisma.$transaction(async (prisma) => {
    const createdTransactions = [];
    for (const transactionData of data) {
      const transaction = await prisma.transaction.create({
        data: {
          employee: { connect: { id: transactionData.employeeId } },
          dueDate: transactionData.dueDate,
          processDate: transactionData.processDate,
          amount: transactionData.amount,
          isEndOfService: transactionData.isEndOfService,
          additions: {
            create: transactionData.additions.map(addition => ({
              reasonId: addition.reasonId,
              amount: addition.amount,
            })),
          },
          deductions: {
            create: transactionData.deductions.map(deduction => ({
              reasonId: deduction.reasonId,
              amount: deduction.amount,
            })),
          },
          salaries: {
            connect: transactionData.salaries.map(salary => ({ id: salary.id })),
          },
        },
        include: {
          employee: true,
          additions: true,
          deductions: true,
          salaries: true,
        },
      });
      createdTransactions.push(transaction);
    }
    return createdTransactions;
  });
};
