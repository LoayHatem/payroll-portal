import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

interface MonthlyAdditionsDeductionsChartProps {
  additions: { month: number; year: number; total_amount: number }[];
  deductions: { month: number; year: number; total_amount: number }[];
}

export const MonthlyAdditionsDeductionsChart: React.FC<MonthlyAdditionsDeductionsChartProps> = ({ additions, deductions }) => {
  const chartData = additions
    .map((addition, index) => ({
      date: `${addition.month}/${addition.year}`,
      additions: addition.total_amount,
      deductions: deductions[index]?.total_amount || 0,
    }))
    .reverse(); // Reverse to show oldest to newest

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Additions and Deductions</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer
          width="100%"
          height={400}
        >
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="additions"
              fill="#82ca9d"
              name="Additions"
            />
            <Bar
              dataKey="deductions"
              fill="#8884d8"
              name="Deductions"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
