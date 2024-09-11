"use client";
import { useState, useEffect } from "react";
import { useEmployeeStore } from "@/stores/employeeStore";
import { useTransactionStore } from "@/stores/transactionStore";
import { Employee } from "@/api/endpoints/employeeEndpoint";
import { Transaction } from "@/api/endpoints/transactionEndpoint";
import { SalariesTable } from "./SalariesTable";
import { SalariesConfirmation } from "./SalariesConfirmation";
import { Button } from "@/components/ui/button";
import { SalariesSuccessPage } from "./SalariesSuccessPage";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SalariesModule() {
  const { employees, fetchEmployees } = useEmployeeStore();
  const { createTransactions } = useTransactionStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedTransactions, setProcessedTransactions] = useState<Transaction[]>([]);

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
      salaries: employee.salaries,
      amount: employee.totalSalary,
      additions: [],
      deductions: [],
      isEndOfService: false,
    };
  };

  const handleNext = () => {
    setStep(2);
  };

  const handlePrevious = () => {
    setStep(1);
  };

  const handleProcessSalaries = async () => {
    setIsProcessing(true);
    const validTransactions = transactions.filter((t) => t.dueDate && !isNaN(new Date(t.dueDate).getTime()));
    const transactionsToCreate = validTransactions.map((t) => ({
      ...t,
      dueDate: new Date(t.dueDate as string).toISOString(),
      processDate: new Date().toISOString(),
    }));
    try {
      const result = await createTransactions(transactionsToCreate);
      setProcessedTransactions(result);
      setStep(3); // New step for success page
    } catch (error) {
      console.error("Error processing salaries:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <ScrollArea
        className="overflow-y-auto px-8 pt-8"
        style={{ height: "calc(100vh - 70px)" }}
      >
        <h1 className="text-2xl font-bold mb-4">Salaries</h1>
        {step === 1 ? (
          <SalariesTable
            transactions={transactions}
            setTransactions={setTransactions}
          />
        ) : step === 2 ? (
          <SalariesConfirmation
            transactions={transactions}
            setTransactions={setTransactions}
          />
        ) : (
          <SalariesSuccessPage transactions={processedTransactions} />
        )}
      </ScrollArea>
      <div className="bottom-0 left-0 right-0 bg-white p-4 shadow-[0px_-5px_42px_0px_rgba(0,0,0,0.15)]">
        <div className="container mx-auto flex justify-between items-center">
          {step === 2 && (
            <Button
              size="lg"
              onClick={handlePrevious}
              variant="outline"
            >
              Previous
            </Button>
          )}
          {step === 1 && <div className="text-md text-gray-600">Set the month/year for Employees salaries to be processed</div>}
          {step === 1 ? (
            <Button
              onClick={handleNext}
              className="ml-auto"
              size="lg"
            >
              Next
            </Button>
          ) : step === 2 ? (
            <Button
              onClick={handleProcessSalaries}
              className="ml-auto"
              disabled={isProcessing}
              size="lg"
              variant="destructive"
            >
              {isProcessing ? "Processing..." : "Process Salaries"}
            </Button>
          ) : (
            <Button
              onClick={() => {
                setStep(1);
                setTransactions([]);
                setProcessedTransactions([]);
              }}
              size="lg"
              className="ml-auto"
            >
              Process New Salaries
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
