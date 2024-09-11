import { prisma } from "@/db/prisma";

export const getCustomFields = async () => {
  return await prisma.customField.findMany({
    orderBy: { name: "asc" },
  });
};

export const createCustomField = async (data: any) => {
  return await prisma.customField.create({
    data,
  });
};

export const updateCustomField = async (id: string, data: any) => {
  return await prisma.customField.update({
    where: { id },
    data,
  });
};

export const deleteCustomField = async (id: string) => {
  return await prisma.customField.delete({
    where: { id },
  });
};

export const getEmployeeCustomFieldData = async (employeeId: string) => {
  return await prisma.customFieldData.findMany({
    where: { employeeId },
    include: { customField: true },
  });
};

export const updateEmployeeCustomFieldData = async (employeeId: string, customFieldId: string, value: string) => {
  return await prisma.customFieldData.upsert({
    where: {
      employeeId_customFieldId: {
        employeeId,
        customFieldId,
      },
    },
    update: { value },
    create: {
      employeeId,
      customFieldId,
      value,
    },
  });
};