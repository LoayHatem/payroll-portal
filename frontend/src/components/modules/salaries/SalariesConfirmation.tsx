import React, { useEffect, useCallback } from "react";
import { Transaction } from "@/api/endpoints/transactionEndpoint";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { useSalaryAdjustmentStore } from "@/stores/salaryAdjustmentStore";
import { SalaryAdjustment } from "@/api/endpoints/salaryAdjustmentEndpoint";
import { evaluate } from "mathjs";

interface SalariesConfirmationProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

export function SalariesConfirmation({ transactions, setTransactions }: SalariesConfirmationProps) {
  const { salaryAdjustments, fetchSalaryAdjustments } = useSalaryAdjustmentStore();

  useEffect(() => {
    fetchSalaryAdjustments().then(() => {
      if (salaryAdjustments.length > 0) {
        const updatedTransactions = transactions.map((transaction) => {
          if (transaction.isEndOfService) {
            const endOfServiceAdjustments = salaryAdjustments.filter((adj) => adj.isEndOfService);
            const newAdditions = [...transaction.additions];

            endOfServiceAdjustments.forEach((adjustment) => {
              if (!transaction.additions.some((add) => add.reasonId === adjustment.id)) {
                const amount = calculateAdjustmentAmount(adjustment, transaction);
                newAdditions.push({
                  id: Date.now().toString(),
                  reasonId: adjustment.id,
                  amount,
                  name: adjustment.name,
                });
              }
            });

            const updatedTransaction = { ...transaction, additions: newAdditions };
            updatedTransaction.amount = calculateTotalAmount(updatedTransaction);
            return updatedTransaction;
          }
          return transaction;
        });

        setTransactions(updatedTransactions);
      }
    });
  }, [setTransactions]);

  const calculateAdjustmentAmount = useCallback((adjustment: SalaryAdjustment, transaction: Transaction) => {
    if (!adjustment.formula) return adjustment.amount || 0;

    const variables = {
      basicSalary: transaction.salaries.reduce((sum, s) => sum + s.amount, 0),
      hourlyRate: transaction.salaries.reduce((sum, s) => sum + s.amount, 0) / 22 / 8,
      dailySalary: transaction.salaries.reduce((sum, s) => sum + s.amount, 0) / 22,
      yearsOfService: calculateYearsOfService(transaction.employee.joiningDate),
    };

    try {
      return evaluate(adjustment.formula, variables);
    } catch (error) {
      console.error("Error evaluating formula:", error);
      return 0;
    }
  }, []);

  const calculateYearsOfService = (joiningDate: string) => {
    const years = new Date().getFullYear() - new Date(joiningDate).getFullYear();
    return Math.max(0, years);
  };

  const calculateTotalAmount = useCallback((transaction: Transaction) => {
    const totalAdditions = transaction.additions.reduce((sum, a) => sum + a.amount, 0);
    const totalDeductions = transaction.deductions.reduce((sum, d) => sum + d.amount, 0);
    return transaction.salaries.reduce((sum, s) => sum + s.amount, 0) + totalAdditions - totalDeductions;
  }, []);

  const validTransactions = transactions.filter((t) => t.dueDate && !isNaN(new Date(t.dueDate).getTime()));

  const totalAmount = validTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>End of Service</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {validTransactions.map((transaction) => (
          <TableRow key={transaction.employeeId}>
            <TableCell>{transaction.employee.name}</TableCell>
            <TableCell>{new Date(transaction.dueDate!).toLocaleDateString()}</TableCell>
            <TableCell>${transaction.amount.toLocaleString()}</TableCell>
            <TableCell>{transaction.isEndOfService ? "Yes" : "No"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total ({validTransactions.length} transactions)</TableCell>
          <TableCell>${totalAmount.toLocaleString()}</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
