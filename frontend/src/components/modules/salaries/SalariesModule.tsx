"use client"
import { useState, useEffect } from "react";
import { useEmployeeStore } from "@/stores/employeeStore";
import { useTransactionStore } from "@/stores/transactionStore";
import { Employee } from "@/api/endpoints/employeeEndpoint";
import { Transaction } from "@/api/endpoints/transactionEndpoint";
import { SalariesTable } from "./SalariesTable";

export default function SalariesModule() {
  const { employees, fetchEmployees } = useEmployeeStore();
  const { createTransaction } = useTransactionStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    if (employees) {
      const generatedTransactions = employees.map(generateTransaction);
      setTransactions(generatedTransactions);
    }
  }, [employees]);

  const generateTransaction = (employee: Employee): Transaction => {
    return {
      id: "",
      employeeId: employee.id,
      employee,
      processDate: new Date().toISOString(),
      salaries: employee.salaries,
      amount: employee.totalSalary,
      additions: [],
      deductions: [],
      isEndOfService: false,
    };
  };

  const handleSaveTransactions = async () => {
    for (const transaction of transactions) {
      await createTransaction(transaction);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Salaries</h1>
      <SalariesTable
        transactions={transactions}
        setTransactions={setTransactions}
      />
      <button
        onClick={handleSaveTransactions}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Save Transactions
      </button>
    </div>
  );
}
