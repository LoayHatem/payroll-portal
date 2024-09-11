import React, { useState, useEffect } from "react";
import SlideoutPanel from "@/components/core/SlideoutPanel";
import { useSalaryAdjustmentStore } from "@/stores/salaryAdjustmentStore";
import { Transaction, Addition, Deduction } from "@/api/endpoints/transactionEndpoint";
import { SalaryAdjustment } from "@/api/endpoints/salaryAdjustmentEndpoint";
import { evaluate, MathNode, parse } from "mathjs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FormulaHighlight } from "@/components/common/FormulaHighlight";
import { PlusCircle, MinusCircle, SquareFunction, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AdditionsDeductionsEditPanelProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
  updateTransaction: (updatedTransaction: Transaction) => void;
}

const AdditionsDeductionsEditPanel: React.FC<AdditionsDeductionsEditPanelProps> = ({
  isOpen,
  onClose,
  transaction,
  updateTransaction,
}) => {
  const { salaryAdjustments, fetchSalaryAdjustments } = useSalaryAdjustmentStore();
  const [selectedAdjustment, setSelectedAdjustment] = useState<SalaryAdjustment | null>(null);
  const [formulaVariables, setFormulaVariables] = useState<Record<string, number>>({});
  const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null);

  const [employeeVariables, setEmployeeVariables] = useState<{
    basicSalary: number;
    hourlyRate: number;
    dailySalary: number;
    yearsOfService: number;
  }>({
    basicSalary: 0,
    hourlyRate: 0,
    dailySalary: 0,
    yearsOfService: 0,
  });

  useEffect(() => {
    fetchSalaryAdjustments();
  }, [fetchSalaryAdjustments]);

  useEffect(() => {
    const variables = calculateEmployeeVariables();
    setEmployeeVariables(variables);
  }, [transaction]);

  useEffect(() => {
    if (selectedAdjustment) {
      const newAmount = calculateAmount();
      setCalculatedAmount(newAmount);
    }
  }, [selectedAdjustment, formulaVariables, employeeVariables]);

  const handleAdjustmentSelect = (adjustmentId: string) => {
    const adjustment = salaryAdjustments.find((adj) => adj.id === adjustmentId);
    setSelectedAdjustment(adjustment || null);
    if (adjustment?.formula) {
      const variables = extractVariables(adjustment.formula);
      setFormulaVariables(variables.reduce((acc, v) => ({ ...acc, [v]: 0 }), {}));
    } else {
      setFormulaVariables({});
    }
  };

  const calculateEmployeeVariables = () => {
    const basicSalary = transaction.salaries.reduce((sum, s) => sum + s.amount, 0);
    const hourlyRate = basicSalary / 22 / 8;
    const dailySalary = basicSalary / 22;
    const years = transaction.employee.joiningDate ? new Date().getFullYear() - new Date(transaction.employee.joiningDate).getFullYear() : 0;
    const yearsOfService = Math.max(0, years);
    return {
      basicSalary,
      hourlyRate,
      dailySalary,
      yearsOfService,
    };
  };

  const extractVariables = (formula: string): string[] => {
    try {
      const node = parse(formula);
      const variables = new Set<string>();

      node.traverse((node) => {
        const symbolNode = node as MathNode & { name: string };
        if (symbolNode.type === 'SymbolNode' && !['e', 'pi', 'i'].includes(symbolNode.name)) {
          variables.add(symbolNode.name);
        }
      });

      return Array.from(variables);
    } catch (error) {
      console.error("Error parsing formula:", error);
      return [];
    }
  };

  const handleVariableChange = (variable: string, value: number) => {
    setFormulaVariables((prev) => {
      const newVariables = { ...prev, [variable]: value };
      const newAmount = calculateAmount(newVariables);
      setCalculatedAmount(newAmount);
      return newVariables;
    });
  };

  const calculateAmount = (variables: Record<string, number> = formulaVariables) => {
    if (!selectedAdjustment?.formula) return selectedAdjustment?.amount || 0;
    const allVariables = {
      ...variables,
      ...employeeVariables,
    };
    try {
      return evaluate(selectedAdjustment.formula, allVariables);
    } catch (error) {
      console.error("Error evaluating formula:", error);
      return 0;
    }
  };

  const handleAddAdjustment = () => {
    if (!selectedAdjustment) return;
    const amount = calculatedAmount || 0;
    const newAdjustment = {
      id: Date.now().toString(),
      reasonId: selectedAdjustment.id,
      amount,
      name: selectedAdjustment.name,
    };
    const updatedTransaction = { ...transaction };
    if (selectedAdjustment.type === "addition") {
      updatedTransaction.additions = [...updatedTransaction.additions, newAdjustment as Addition];
    } else {
      updatedTransaction.deductions = [...updatedTransaction.deductions, newAdjustment as Deduction];
    }
    updatedTransaction.amount = calculateTotalAmount(updatedTransaction);
    updateTransaction(updatedTransaction);
    setSelectedAdjustment(null);
    setFormulaVariables({});
    setCalculatedAmount(null);
  };

  const calculateTotalAmount = (transaction: Transaction) => {
    const totalAdditions = transaction.additions.reduce((sum, a) => sum + a.amount, 0);
    const totalDeductions = transaction.deductions.reduce((sum, d) => sum + d.amount, 0);
    return transaction.salaries.reduce((sum, s) => sum + s.amount, 0) + totalAdditions - totalDeductions;
  };

  const calculateTotalAdditions = () => {
    return transaction.additions.reduce((sum, a) => sum + a.amount, 0);
  };

  const calculateTotalDeductions = () => {
    return transaction.deductions.reduce((sum, d) => sum + d.amount, 0);
  };

  const calculateFinalSalary = () => {
    const baseSalary = transaction.salaries.reduce((sum, s) => sum + s.amount, 0);
    return baseSalary + calculateTotalAdditions() - calculateTotalDeductions();
  };

  const handleRemoveAdjustment = (id: string, type: 'addition' | 'deduction') => {
    const updatedTransaction = { ...transaction };
    if (type === 'addition') {
      updatedTransaction.additions = updatedTransaction.additions.filter(a => a.id !== id);
    } else {
      updatedTransaction.deductions = updatedTransaction.deductions.filter(d => d.id !== id);
    }
    updatedTransaction.amount = calculateTotalAmount(updatedTransaction);
    updateTransaction(updatedTransaction);
  };

  return (
    <SlideoutPanel
      isOpen={isOpen}
      onOpenChange={onClose}
      title="Edit Additions and Deductions"
    >
      <div className="space-y-6 mt-4">
        {/* Employee Info */}
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-12 w-12">
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${transaction.employee.name}`} />
            <AvatarFallback>{transaction.employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">{transaction.employee.name}</h2>
            <p className="text-sm text-gray-500">{transaction.employee.position}</p>
          </div>
        </div>

        <Select
          onValueChange={handleAdjustmentSelect}
          value={selectedAdjustment?.id || ""}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an adjustment" />
          </SelectTrigger>
          <SelectContent>
            {salaryAdjustments &&
              salaryAdjustments.map((adj) => (
                <SelectItem
                  key={adj.id}
                  value={adj.id}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      {adj.type === "addition" ? (
                        <PlusCircle className="mr-2 h-4 w-4 text-green-500" />
                      ) : (
                        <MinusCircle className="mr-2 h-4 w-4 text-red-500" />
                      )}
                      <span className={adj.type === "addition" ? "text-green-600" : "text-red-600"}>{adj.name}</span>
                    </div>
                    <div className="flex items-center">
                      {adj.formula ? (
                        <SquareFunction className="ml-2 h-4 w-4 text-blue-500" />
                      ) : (
                        <span className="ml-2 text-sm text-gray-500">${adj.amount?.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {selectedAdjustment?.formula ? (
          <Card>
            <CardHeader>
              <CardTitle>Formula</CardTitle>
            </CardHeader>
            <CardContent>
              <FormulaHighlight
                formula={selectedAdjustment.formula}
                language="javascript"
              />
              <div className="mt-4 space-y-4">
                {Object.entries(formulaVariables).map(([variable, value]) => (
                  <div
                    key={variable}
                    className="space-y-2"
                  >
                    <Label htmlFor={variable}>{variable}:</Label>
                    {employeeVariables[variable as keyof typeof employeeVariables] !== undefined ? (
                      <p>{employeeVariables[variable as keyof typeof employeeVariables]?.toLocaleString()}</p>
                    ) : (
                      <Input
                        id={variable}
                        type="number"
                        value={value}
                        onChange={(e) => handleVariableChange(variable, parseFloat(e.target.value))}
                      />
                    )}
                  </div>
                ))}
              </div>
              {calculatedAmount !== null && (
                <div className="mt-4">
                  <Label>Calculated Amount:</Label>
                  <p className="text-lg font-semibold">${calculatedAmount.toLocaleString()}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : selectedAdjustment ? (
          <Card>
            <CardHeader>
              <CardTitle>Fixed Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">${selectedAdjustment.amount?.toFixed(2)}</p>
            </CardContent>
          </Card>
        ) : null}

        <Button
          onClick={handleAddAdjustment}
          disabled={!selectedAdjustment}
          className="w-full"
        >
          Add {selectedAdjustment?.type === "addition" ? "Addition" : "Deduction"}
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Current Additions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {transaction.additions.map((addition) => (
                <li key={addition.id} className="flex justify-between items-center">
                  <span>{addition.name}: ${addition.amount.toFixed(2)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAdjustment(addition.id, 'addition')}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {transaction.deductions.map((deduction) => (
                <li key={deduction.id} className="flex justify-between items-center">
                  <span>{deduction.name}: ${deduction.amount.toFixed(2)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAdjustment(deduction.id, 'deduction')}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Salary Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Salary Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Base Salary:</span>
                <span>${transaction.salaries.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Total Additions:</span>
                <span>+${calculateTotalAdditions().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Total Deductions:</span>
                <span>-${calculateTotalDeductions().toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Final Salary:</span>
                <span>${calculateFinalSalary().toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Button className="w-full my-4" variant="destructive" onClick={onClose}>
            Finish
        </Button>
      </div>
    </SlideoutPanel>
  );
};

export default AdditionsDeductionsEditPanel;
