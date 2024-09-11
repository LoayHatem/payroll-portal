"use client";
import { useMemo } from "react";
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import { useTransactionStore } from "@/stores/transactionStore";
import { Transaction } from "@/api/endpoints/transactionEndpoint";
import { Badge, Text, Box } from "@mantine/core";
import { FaPlus, FaMinus } from "react-icons/fa";

export default function PaymentHistoryTable() {
  const { transactions } = useTransactionStore();

  const columns = useMemo<MRT_ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: "employee.name",
        header: "Employee Name",
        size: 200,
      },
      {
        accessorKey: "dueDate",
        header: "Due Date",
        size: 150,
        Cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleDateString(),
      },
      {
        accessorFn: (row) => row.salaries.reduce((sum, addition) => sum + addition.amount, 0),
        header: "Salary",
        size: 150,
        AggregatedCell: ({ cell }) => (
          <>
            Total :
            <Box sx={{ color: "blue", display: "inline", fontWeight: "bold" }}>${cell.getValue<number>().toLocaleString()}</Box>
          </>
        ),
        Cell: ({ cell }) => (
          <Text
            color="blue"
            weight={700}
          >
            {cell.getValue<number>().toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </Text>
        ),
      },
      {
        accessorFn: (row) => row.additions.reduce((sum, addition) => sum + addition.amount, 0),
        header: "Additions",
        size: 150,
        AggregatedCell: ({ cell }) => (
          <>
            Total :
            <Box sx={{ color: "green", display: "inline", fontWeight: "bold" }}>+${cell.getValue<number>().toLocaleString()}</Box>
          </>
        ),
        Cell: ({ cell }) => (
          <Text
            color="green"
            weight={700}
          >
            <FaPlus
              size={12}
              style={{ marginRight: "4px", display: "inline" }}
            />
            {cell.getValue<number>().toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </Text>
        ),
      },
      {
        accessorFn: (row) => row.deductions.reduce((sum, deduction) => sum + deduction.amount, 0),
        header: "Deductions",
        size: 150,
        AggregatedCell: ({ cell }) => (
          <>
            Total :<Box sx={{ color: "red", display: "inline", fontWeight: "bold" }}>-${cell.getValue<number>().toLocaleString()}</Box>
          </>
        ),
        Cell: ({ cell }) => (
          <Text
            color="red"
            weight={700}
          >
            <FaMinus
              size={12}
              style={{ marginRight: "4px", display: "inline" }}
            />
            {cell.getValue<number>().toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </Text>
        ),
      },
      {
        accessorKey: "amount",
        header: "Total",
        size: 150,
        AggregatedCell: ({ cell }) => (
          <>
            Total
            <Badge
              color="orange"
              size="lg"
              radius="xl"
              style={{ minWidth: "100px" }}
            >
              ${cell.getValue<number>().toLocaleString()}
            </Badge>
          </>
        ),
        Cell: ({ cell }) => (
          <Badge
            color="orange"
            size="lg"
            radius="xl"
            style={{ minWidth: "100px" }}
          >
            {cell.getValue<number>().toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </Badge>
        ),
        Footer: ({ table }) => {
          const groupedRows = table.getGroupedRowModel().flatRows;
          const total = groupedRows.reduce((sum, row) => sum + row.original.amount, 0);
          return <Text weight={700}>Total: {total.toLocaleString("en-US", { style: "currency", currency: "USD" })}</Text>;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 100,
      },
    ],
    [],
  );

  const table = useMantineReactTable({
    columns,
    data: transactions || [],
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enablePinning: true,
    enableRowActions: false,
    enableRowSelection: false,
    initialState: {
      grouping: ["dueDate"],
      density: "xs",
      sorting: [{ id: "dueDate", desc: true }],
      pagination: { pageIndex: 0, pageSize: 30 },
    },
    mantineToolbarAlertBannerProps: { color: "red", variant: "outline" },
    mantineTableContainerProps: { sx: { maxHeight: "calc(100vh - 125px)" } },
    renderDetailPanel: ({ row }) => (
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          width: "100%",
          padding: "16px",
          backgroundColor: "#f1f3f5",
        }}
      >
        <Text
          weight={700}
          size="lg"
        >
          Group Total:{" "}
          {row.subRows
            ?.reduce((sum, subRow) => sum + subRow.original.amount, 0)
            .toLocaleString("en-US", { style: "currency", currency: "USD" })}
        </Text>
      </Box>
    ),
  });

  return <MantineReactTable table={table} />;
}
