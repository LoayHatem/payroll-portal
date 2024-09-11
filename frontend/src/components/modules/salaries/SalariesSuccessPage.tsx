import React from 'react';
import { Transaction } from '@/api/endpoints/transactionEndpoint';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SalariesSuccessPageProps {
  transactions: Transaction[];
}

export function SalariesSuccessPage({ transactions }: SalariesSuccessPageProps) {
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalEmployees = transactions.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">Salaries Processed Successfully</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total amount processed: ${totalAmount.toLocaleString()}</p>
          <p>Number of employees: {totalEmployees}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Processed Salaries Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Process Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.employee.name}</TableCell>
                  <TableCell>${transaction.amount.toLocaleString()}</TableCell>
                  <TableCell>{new Date(transaction.processDate as string || "").toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}