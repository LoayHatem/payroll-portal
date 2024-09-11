import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface MonthlySalariesChartProps {
  data: { month: number; year: number; amount: number }[];
}

export const MonthlySalariesChart: React.FC<MonthlySalariesChartProps> = ({ data }) => {
  const chartData = data?.map(item => ({
    name: `${item.month}/${item.year}`,
    total: item.amount
  }));

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Monthly Salaries</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};