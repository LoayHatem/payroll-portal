import React, { useState, useEffect } from 'react';
import { useSalaryAdjustmentStore } from '@/stores/salaryAdjustmentStore';
import { SalaryAdjustment } from '@/api/endpoints/salaryAdjustmentEndpoint';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { evaluate, MathNode, parse } from 'mathjs';
import { FormulaHighlight } from '@/components/common/FormulaHighlight';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Info, AlertTriangle, Calculator, Plus, Minus, HelpCircle, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SalaryAdjustmentEditPanelProps {
  adjustment: SalaryAdjustment | null;
  onClose: () => void;
}

const SalaryAdjustmentEditPanel: React.FC<SalaryAdjustmentEditPanelProps> = ({ adjustment, onClose }) => {
  const { createSalaryAdjustment, updateSalaryAdjustment } = useSalaryAdjustmentStore();
  const [editedAdjustment, setEditedAdjustment] = useState<Partial<SalaryAdjustment>>({
    name: '',
    description: '',
    type: 'addition',
    amount: 0,
    formula: '',
    isEndOfService: false,
  });
  const [formulaVariables, setFormulaVariables] = useState<Record<string, number>>({});
  const [calculatedAmount, setCalculatedAmount] = useState<number | null>(null);

  const [isImportantNoteOpen, setIsImportantNoteOpen] = useState(true);
  const [isFormulaHelpOpen, setIsFormulaHelpOpen] = useState(true);
  const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(true);
  const [isFormulaOpen, setIsFormulaOpen] = useState(true);
  const [isVariablesOpen, setIsVariablesOpen] = useState(true);

  useEffect(() => {
    if (adjustment) {
      setEditedAdjustment(adjustment);
      if (adjustment.formula) {
        const variables = extractVariables(adjustment.formula);
        setFormulaVariables(variables.reduce((acc, v) => ({ ...acc, [v]: 0 }), {}));
      }
    }
  }, [adjustment]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedAdjustment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditedAdjustment((prev) => ({ ...prev, [name]: value }));
  };

  const extractVariables = (formula: string): string[] => {
    try {
      const node = parse(formula);
      const variables = new Set<string>();

      node.traverse((node) => {
        const symbolNode = node as MathNode & { name: string };
        if (symbolNode.type === 'SymbolNode' && !['e', 'pi', 'i', "min"].includes(symbolNode.name)) {
          variables.add(symbolNode.name);
        }
      });

      return Array.from(variables);
    } catch (error) {
      console.error("Error parsing formula:", error);
      return [];
    }
  };

  const handleFormulaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const formula = e.target.value;
    setEditedAdjustment((prev) => ({ ...prev, formula }));
    const variables = extractVariables(formula);
    setFormulaVariables(variables.reduce((acc, v) => ({ ...acc, [v]: 0 }), {}));
  };

  const handleVariableChange = (variable: string, value: number) => {
    setFormulaVariables((prev) => ({ ...prev, [variable]: value }));
  };

  const evaluateFormula = () => {
    if (!editedAdjustment.formula) return;
    try {
      const result = evaluate(editedAdjustment.formula, formulaVariables);
      setCalculatedAmount(result);
    } catch (error) {
      console.error("Error evaluating formula:", error);
      setCalculatedAmount(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adjustment) {
      updateSalaryAdjustment(adjustment.id, editedAdjustment as SalaryAdjustment);
    } else {
      createSalaryAdjustment(editedAdjustment as SalaryAdjustment);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-7">
      {adjustment?.id && <Collapsible open={isImportantNoteOpen} onOpenChange={setIsImportantNoteOpen}>
        <CollapsibleTrigger className="flex items-center w-full p-2 bg-yellow-100 rounded-md">
          <AlertTriangle className="h-5 w-5 mr-2 text-yellow-700" />
          <span className="font-semibold text-yellow-800">Important Note</span>
          {isImportantNoteOpen ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 bg-yellow-50 rounded-md mt-2 border border-yellow-200">
          <p className="text-yellow-800">
            Updating this adjustment will not affect previous salaries that used this Adjustment.
          </p>
        </CollapsibleContent>
      </Collapsible>}

      <Collapsible open={isBasicInfoOpen} onOpenChange={setIsBasicInfoOpen}>
        <CollapsibleTrigger className="flex items-center w-full p-2 bg-blue-100 rounded-md">
          <Info className="h-5 w-5 mr-2 text-blue-700" />
          <span className="font-semibold text-blue-800">Basic Information</span>
          {isBasicInfoOpen ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 border border-blue-200 rounded-md mt-2">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={editedAdjustment.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={editedAdjustment.description}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={editedAdjustment.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="addition"><Plus className="h-4 w-4 inline-block mr-2" /> Addition</SelectItem>
                  <SelectItem value="deduction"><Minus className="h-4 w-4 inline-block mr-2" /> Deduction</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={isFormulaOpen} onOpenChange={setIsFormulaOpen}>
        <CollapsibleTrigger className="flex items-center w-full p-2 bg-green-100 rounded-md">
          <Calculator className="h-5 w-5 mr-2 text-green-700" />
          <span className="font-semibold text-green-800">Formula</span>
          {isFormulaOpen ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 border border-green-200 rounded-md mt-2">
          <div className="space-y-4">
            <div>
              <Label htmlFor="formula">Formula</Label>
              <Textarea
                id="formula"
                name="formula"
                value={editedAdjustment.formula}
                onChange={handleFormulaChange}
                placeholder="Enter formula (e.g., basicSalary * 0.1)"
                className="font-mono"
              />
            </div>
            <Collapsible open={isFormulaHelpOpen} onOpenChange={setIsFormulaHelpOpen}>
              <CollapsibleTrigger className="flex items-center w-full p-2 bg-green-200 rounded-md">
                <HelpCircle className="h-4 w-4 mr-2 text-green-700" />
                <span className="font-semibold text-green-800">Formula Help</span>
                {isFormulaHelpOpen ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="p-4 bg-green-50 rounded-md mt-2 border border-green-300">
                <h4 className="font-semibold text-green-800 mb-2">You can use any math notation. Examples:</h4>
                <ul className="list-disc list-inside space-y-2 text-green-700">
                  <li>Basic percentage: <code className="bg-green-200 px-1 rounded">baseSalary * 0.05</code></li>
                  <li>Conditional: <code className="bg-green-200 px-1 rounded">yearsOfService {'>'} 5 ? baseSalary * 0.1 : baseSalary * 0.05</code></li>
                  <li>Complex calculation: <code className="bg-green-200 px-1 rounded">min(baseSalary * 0.2, 1000) + (overtimeHours * hourlyRate * 1.5)</code></li>
                </ul>
                <p className="mt-4 text-green-800">You can add variables as needed, they will be extracted for manual input during addition.</p>
                <h4 className="font-semibold text-green-800 mt-4 mb-2">Available Employee Computed variables:</h4>
                <ul className="list-disc list-inside space-y-2 text-green-700">
                  <li><strong>baseSalary</strong>: Base monthly salary (e.g., 5000)</li>
                  <li><strong>hourlyRate</strong>: Hourly rate based on base salary (e.g., 28.85)</li>
                  <li><strong>dailySalary</strong>: Daily salary based on base salary (e.g., 230.77)</li>
                  <li><strong>yearsOfService</strong>: Years of service (e.g., 3)</li>
                </ul>
                <p className="mt-4 text-green-800">You can use these variables to create a formula that will be used to calculate the salary adjustment.</p>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {editedAdjustment.formula && (
        <Collapsible open={isVariablesOpen} onOpenChange={setIsVariablesOpen}>
          <CollapsibleTrigger className="flex items-center w-full p-2 bg-purple-100 rounded-md">
            <HelpCircle className="h-5 w-5 mr-2 text-purple-700" />
            <span className="font-semibold text-purple-800">Variables and Evaluation</span>
            {isVariablesOpen ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 border border-purple-200 rounded-md mt-2">
            <div className="space-y-4">
              <div>
                <Label>Current Formula:</Label>
                <FormulaHighlight formula={editedAdjustment.formula} language="javascript" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(formulaVariables).map(([variable, value]) => (
                  <div key={variable} className="space-y-1">
                    <Label htmlFor={variable}>{variable}:</Label>
                    <Input
                      id={variable}
                      type="number"
                      value={value}
                      onChange={(e) => handleVariableChange(variable, parseFloat(e.target.value))}
                    />
                  </div>
                ))}
              </div>
              <Button type="button" onClick={evaluateFormula} className="mt-4">
                <Calculator className="h-4 w-4 mr-2" /> Evaluate Formula
              </Button>
              {calculatedAmount !== null && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Calculated Amount</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">${calculatedAmount.toLocaleString()}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      <div>
        <Label htmlFor="amount">Fixed Amount (if no formula)</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          value={editedAdjustment.amount}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="isEndOfService"
          checked={editedAdjustment.isEndOfService}
          onCheckedChange={(checked) => handleSelectChange('isEndOfService', checked.toString())}
        />
        <Label htmlFor="isEndOfService">Is End of Service</Label>
      </div>
      <Button type="submit" className="w-full">
        <Save className="h-4 w-4 mr-2" /> Save Adjustment
      </Button>
    </form>
  );
};

export default SalaryAdjustmentEditPanel;