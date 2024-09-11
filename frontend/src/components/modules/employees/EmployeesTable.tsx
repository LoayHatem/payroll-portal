"use client";
import { useMemo } from "react";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  MRT_GlobalFilterTextInput,
  MRT_ToggleFiltersButton,
} from "mantine-react-table";
import { Button, Flex, Menu } from "@mantine/core";
import { FaUser, FaEnvelope, FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import { useEmployeeStore } from "@/stores/employeeStore";
import { Employee } from "@/api/endpoints/employeeEndpoint";
import EmployeeAvatar from "@/components/core/EmployeeAvatar";

interface EmployeesTableProps {
  openEditPanel: (employee: Employee) => void;
  openAddPanel: () => void;
}

export default function EmployeesTable({ openEditPanel, openAddPanel }: EmployeesTableProps) {
  const { employees, deleteEmployee } = useEmployeeStore();

  const columns = useMemo<MRT_ColumnDef<Employee>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 150,
        filterVariant: "autocomplete",
        Cell: ({ row, renderedCellValue }) => (
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => openEditPanel(row.original)}
          >
            <EmployeeAvatar
              name={row.original.name}
              size={30}
            />
            <span>{renderedCellValue}</span>
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 200,
        enableClickToCopy: true,
      },
      {
        accessorKey: "position",
        header: "Position",
        size: 150,
      },
      {
        accessorKey: "joiningDate",
        header: "Joining Date",
        size: 150,
        Cell: ({ cell }) => (cell.getValue<string>() ? new Date(cell.getValue<string>()).toLocaleDateString() : "Not started yet"),
      },
      {
        accessorKey: "totalSalary",
        header: "Salary",
        size: 200,
        filterVariant: "range-slider",
        filterFn: "betweenInclusive",
        mantineFilterRangeSliderProps: {
          color: "red",
          label: (value) =>
            value?.toLocaleString?.("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }),
        },
        Cell: ({ cell }) =>
          cell.getValue<number>().toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }),
      },
    ],
    [],
  );

  const table = useMantineReactTable({
    columns,
    data: employees || [],
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enablePinning: true,
    enableRowActions: true,
    enableRowSelection: true,
    enableColumnResizing: true,
    enableGrouping: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
      density: "xs",
      pagination: { pageIndex: 0, pageSize: 30 },
    },
    mantineToolbarAlertBannerBadgeProps: { color: "red", variant: "outline" },
    mantineSearchTextInputProps: {
      placeholder: "Search Employees",
    },
    mantineTableContainerProps: { sx: { maxHeight: "calc(100vh - 125px)" } },
    displayColumnDefOptions: {
      "mrt-row-actions": {
        header: "#",
        size: 50,
      },
    },
    mantineToolbarAlertBannerProps: { color: "red", variant: "outline" },
    renderRowActionMenuItems: ({ row }) => (
      <>
        <Menu.Item
          icon={<FaUser />}
          onClick={() => openEditPanel(row.original)}
        >
          View Profile
        </Menu.Item>
        <Menu.Item icon={<FaEnvelope />}>Send Email</Menu.Item>
        <Menu.Item
          icon={<FaEdit />}
          onClick={() => openEditPanel(row.original)}
        >
          Edit
        </Menu.Item>
        <Menu.Item
          icon={<FaTrash />}
          onClick={() => deleteEmployee(row.original.id)}
          color="red"
        >
          Delete
        </Menu.Item>
      </>
    ),
    renderTopToolbar: ({ table }) => (
      <Flex
        p="md"
        justify="space-between"
      >
        <Flex gap="xs">
          <MRT_GlobalFilterTextInput table={table} />
          <MRT_ToggleFiltersButton table={table} />
        </Flex>
        <Button
          leftIcon={<FaPlus />}
          onClick={openAddPanel}
        >
          Add New Employee
        </Button>
      </Flex>
    ),
  });

  return <MantineReactTable table={table} />;
}
