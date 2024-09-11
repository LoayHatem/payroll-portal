import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Salary, SalaryType } from "@/api/endpoints/employeeEndpoint";

interface SalariesTableProps {
  salaries: Salary[];
  salaryTypes: SalaryType[];
  onAddSalary: (salary: Salary) => void;
  onDeleteSalary: (salaryId: string) => void;
}

const SalariesTable: React.FC<SalariesTableProps> = ({ salaries, salaryTypes, onAddSalary, onDeleteSalary }) => {
  const [newSalary, setNewSalary] = useState<Partial<Salary>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSalary({ ...newSalary, [e.target.name]: e.target.value });
  };

  const handleSalaryTypeChange = (value: string) => {
    setNewSalary({ ...newSalary, salaryTypeId: value });
  };

  const handleAddSalary = () => {
    if (newSalary.amount && newSalary.month && newSalary.year && newSalary.salaryTypeId) {
      onAddSalary(newSalary as Salary);
      setNewSalary({});
    }
  };

  const totalAmount = salaries.reduce((sum, salary) => sum + salary?.amount || 0, 0);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salaries.map((salary) => (
            <TableRow key={salary.id}>
              <TableCell>{salary.month}</TableCell>
              <TableCell>{salary.year}</TableCell>
              <TableCell>{salary.amount}</TableCell>
              <TableCell>{salary.type.name}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => onDeleteSalary(salary.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <Input
                type="number"
                name="month"
                placeholder="Month"
                value={newSalary.month || ''}
                onChange={handleInputChange}
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                name="year"
                placeholder="Year"
                value={newSalary.year || ''}
                onChange={handleInputChange}
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                name="amount"
                placeholder="Amount"
                value={newSalary.amount || ''}
                onChange={handleInputChange}
              />
            </TableCell>
            <TableCell>
              <Select onValueChange={handleSalaryTypeChange} value={newSalary.salaryTypeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {salaryTypes && salaryTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <Button onClick={handleAddSalary}>Add</Button>
            </TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell>{totalAmount}</TableCell>
            <TableCell colSpan={2}></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default SalariesTable;