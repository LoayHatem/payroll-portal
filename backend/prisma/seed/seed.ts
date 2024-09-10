import { PrismaClient } from "@prisma/client";
import { generateEmployees } from "./employeeData";

const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: "hashed_password_here", // Remember to hash this in a real scenario
      name: "Admin User",
    },
  });

  // Create salary types
  const salaryTypes = await prisma.salaryType.createMany({
    data: [
      { name: "Basic Salary", description: "Base salary for the employee" },
      { name: "Housing Allowance", description: "Allowance for housing expenses" },
      { name: "Transportation Allowance", description: "Allowance for transportation costs" },
      { name: "Food Allowance", description: "Allowance for food expenses" },
      { name: "Utility Allowance", description: "Allowance for utility bills" },
      { name: "Communication Allowance", description: "Allowance for phone and internet expenses" },
    ],
  });

  // Create salary adjustments
  const salaryAdjustments = await prisma.salaryAdjustment.createMany({
    data: [
      // ... (keep the existing salary adjustments data)
    ],
  });

  const employees = generateEmployees(300);

  for (const employeeData of employees) {
    const employee = await prisma.employee.create({
      data: {
        name: employeeData.name,
        email: employeeData.email,
        position: employeeData.position,
        joiningDate: employeeData.joiningDate,
        userId: user.id,
      },
    });
    // Generate a random month and year in the last 7 years
    const currentDate = new Date();
    const randomDate = new Date(
      currentDate.getFullYear() - Math.floor(Math.random() * 7),
      Math.floor(Math.random() * 12),
      1
    );

    // Create basic salary for the employee
    await prisma.salary.create({
      data: {
        employeeId: employee.id,
        userId: user.id,
        month: randomDate.getMonth() + 1,
        year: randomDate.getFullYear(),
        value: employeeData.salary,
        salaryTypeId: (await prisma.salaryType.findFirst({ where: { name: "Basic Salary" } }))!.id,
      },
    });

    // Create allowances for the employee
    for (const [allowanceName, allowanceValue] of Object.entries(employeeData.allowances)) {
      const salaryType = await prisma.salaryType.findFirst({
        where: { name: `${allowanceName.charAt(0).toUpperCase() + allowanceName.slice(1)} Allowance` },
      });

      if (salaryType) {
        await prisma.salary.create({
          data: {
            employeeId: employee.id,
            userId: user.id,
            month: randomDate.getMonth() + 1,
            year: randomDate.getFullYear(),
            value: allowanceValue,
            salaryTypeId: salaryType.id,
          },
        });
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
