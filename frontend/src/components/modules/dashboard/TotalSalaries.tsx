import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaDollarSign } from 'react-icons/fa';

interface TotalSalariesProps {
  amount: number;
}

export const TotalSalaries: React.FC<TotalSalariesProps> = ({ amount }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Salaries</CardTitle>
        <FaDollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${amount?.toLocaleString()}</div>
      </CardContent>
    </Card>
  );
};