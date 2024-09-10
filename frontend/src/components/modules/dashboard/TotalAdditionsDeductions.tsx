import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaPlus, FaMinus } from 'react-icons/fa';

interface TotalAdditionsDeductionsProps {
  additions: number;
  deductions: number;
}

export const TotalAdditionsDeductions: React.FC<TotalAdditionsDeductionsProps> = ({ additions, deductions }) => {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Additions/Deductions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <div className="flex items-center">
            <FaPlus className="mr-2 text-green-500" />
            <span className="text-xl font-bold">${additions.toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <FaMinus className="mr-2 text-red-500" />
            <span className="text-xl font-bold">${deductions.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};