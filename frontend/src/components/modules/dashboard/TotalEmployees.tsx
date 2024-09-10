import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaUsers } from 'react-icons/fa';

interface TotalEmployeesProps {
  count: number;
}

export const TotalEmployees: React.FC<TotalEmployeesProps> = ({ count }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
        <FaUsers className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
      </CardContent>
    </Card>
  );
};