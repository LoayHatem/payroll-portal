import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction } from '@/api/endpoints/transactionEndpoint';
import { Edit2 } from 'lucide-react';
import AdditionsDeductionsEditPanel from './AdditionsDeductionsEditPanel';

interface SalariesTableProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

export function SalariesTable({ transactions, setTransactions }: SalariesTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleDateChange = (id: string, date: string) => {
    setTransactions(prev =>
      prev.map(t => t.employeeId === id ? { ...t, dueDate: date } : t)
    );
  };

  const handleEndOfServiceChange = (id: string, isEndOfService: boolean) => {
    setTransactions(prev =>
      prev.map(t => t.employeeId === id ? { ...t, isEndOfService } : t)
    );
  };

  const handleEditAdditionsDeductions = (id: string) => {
    setEditingId(id);
  };

  const handleCloseEditPanel = () => {
    setEditingId(null);
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev =>
      prev.map(t => t.employeeId === updatedTransaction.employeeId ? updatedTransaction : t)
    );
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Month/Year</TableHead>
            <TableHead>Basic Salary</TableHead>
            <TableHead>Additions</TableHead>
            <TableHead>Deductions</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>End of Service</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.employeeId}>
              <TableCell>{transaction.employee.name}</TableCell>
              <TableCell>
                <input
                  type="month"
                  value={transaction.dueDate?.slice(0, 7) || ''}
                  onChange={(e) => handleDateChange(transaction.employeeId, e.target.value)}
                  className="border rounded p-1"
                />
              </TableCell>
              <TableCell>${transaction.salaries?.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}</TableCell>
              <TableCell>
                ${transaction.additions.reduce((sum, a) => sum + a.amount, 0).toLocaleString()}
                <Edit2 
                  className="inline-block ml-2 cursor-pointer" 
                  size={16} 
                  onClick={() => handleEditAdditionsDeductions(transaction.employeeId)}
                />
              </TableCell>
              <TableCell>
                ${transaction.deductions.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                <Edit2 
                  className="inline-block ml-2 cursor-pointer" 
                  size={16} 
                  onClick={() => handleEditAdditionsDeductions(transaction.employeeId)}
                />
              </TableCell>
              <TableCell>${transaction.amount.toLocaleString()}</TableCell>
              <TableCell>
                <input
                  type="checkbox"
                  checked={transaction.isEndOfService}
                  onChange={(e) => handleEndOfServiceChange(transaction.employeeId, e.target.checked)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editingId && (
        <AdditionsDeductionsEditPanel
          isOpen={!!editingId}
          onClose={handleCloseEditPanel}
          transaction={transactions.find(t => t.employeeId === editingId)!}
          updateTransaction={updateTransaction}
        />
      )}
    </>
  );
}