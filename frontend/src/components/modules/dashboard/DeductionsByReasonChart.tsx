import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface DeductionsByReasonChartProps {
  data: { id: string; name: string; total_amount: number }[];
}

export const DeductionsByReasonChart: React.FC<DeductionsByReasonChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    name: item.name,
    amount: item.total_amount
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Deductions by Reason</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};