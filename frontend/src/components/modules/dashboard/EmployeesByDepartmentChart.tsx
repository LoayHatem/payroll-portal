import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface EmployeesByDepartmentChartProps {
  data: { position: string; _count: number }[];
}

export const EmployeesByDepartmentChart: React.FC<EmployeesByDepartmentChartProps> = ({ data }) => {
  const chartData = data.map(item => ({
    department: item.position,
    count: item._count
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Departments by Employee Count</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis type="number" />
            <YAxis dataKey="department" type="category" width={150} />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};