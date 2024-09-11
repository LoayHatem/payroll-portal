import { Addition, Deduction, PrismaClient, Salary } from "@prisma/client";
import { generateEmployees } from "./employeeData";
import { salaryAndAllowances } from "./salaryData";

const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      email: "admin@mail.com",
      password: "$2b$10$Q5lrACVTYmCmmymvbvL00.UVGx70akSr0ixExCyEzmNZvIQvl6i1u",
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
  await prisma.salaryAdjustment.createMany({
    data: salaryAndAllowances,
  });

  const allSalaryAdjustments = await prisma.salaryAdjustment.findMany();

  const employees = generateEmployees(300);

  for (const employeeData of employees) {
    const employee = await prisma.employee.create({
      data: {
        name: employeeData.name,
        email: employeeData.email,
        position: employeeData.position,
        joiningDate: employeeData.joiningDate,
      },
    });
    // Generate a random month and year in the last 7 years
    const currentDate = new Date();
    const randomDate = new Date(currentDate.getFullYear() - Math.floor(Math.random() * 7), Math.floor(Math.random() * 12), 1);

    // Create basic salary for the employee
    await prisma.salary.create({
      data: {
        employeeId: employee.id,
        month: randomDate.getMonth() + 1,
        year: randomDate.getFullYear(),
        amount: employeeData.salary,
        salaryTypeId: (await prisma.salaryType.findFirst({ where: { name: "Basic Salary" } }))!.id,
      },
    });

    const employeeAllowances: Salary[] = [];

    // Create allowances for the employee
    for (const [allowanceName, allowanceValue] of Object.entries(employeeData.allowances)) {
      const salaryType = await prisma.salaryType.findFirst({
        where: { name: `${allowanceName.charAt(0).toUpperCase() + allowanceName.slice(1)} Allowance` },
      });

      if (salaryType) {
        const salary = await prisma.salary.create({
          data: {
            employeeId: employee.id,
            month: randomDate.getMonth() + 1,
            year: randomDate.getFullYear(),
            amount: allowanceValue,
            salaryTypeId: salaryType.id,
          },
        });
        employeeAllowances.push(salary);
      }
    }

    // Create transactions for 9 months (January 2024 to September 2024)
    for (let month = 1; month <= 9; month++) {
      const transactionStates = ["pending", "inprogress", "paid"];
      const randomState = transactionStates[Math.floor(Math.random() * transactionStates.length)];

      const baseSalary = employeeAllowances.reduce((acc, salary) => acc + salary.amount, 0);

      // Create transaction
      const transaction = await prisma.transaction.create({
        data: {
          employeeId: employee.id,
          status: randomState,
          dueDate: new Date(2024, month - 1, 28), // Set due date to 28th of each month
          amount: baseSalary,
        },
      });

      // Generate random additions and deductions
      const additionAdjustments = allSalaryAdjustments.filter((adjustment) => adjustment.type === "addition");
      const deductionAdjustments = allSalaryAdjustments.filter((adjustment) => adjustment.type === "deduction");

      let totalAdditions = 0;
      let totalDeductions = 0;

      const additions: Addition[] = [];

      // Create additions
      for (const adjustment of additionAdjustments) {
        if (Math.random() < 0.3) {
          // 30% chance of having this addition
          const amount = adjustment.amount > 0 ? adjustment.amount : Math.round(baseSalary * Math.random() * 0.1);
          totalAdditions += amount;
          const addition = await prisma.addition.create({
            data: {
              reasonId: adjustment.id,
              transactionId: transaction.id,
              amount: amount,
            },
          });
          additions.push(addition);
        }
      }

      const deductions: Deduction[] = [];

      // Create deductions
      for (const adjustment of deductionAdjustments) {
        if (Math.random() < 0.3) {
          // 30% chance of having this deduction
          const amount = adjustment.amount > 0 ? adjustment.amount : Math.round(baseSalary * Math.random() * 0.05);
          totalDeductions += amount;
          const deduction = await prisma.deduction.create({
            data: {
              reasonId: adjustment.id,
              transactionId: transaction.id,
              amount: amount,
            },
          });
          deductions.push(deduction);
        }
      }

      // Update transaction with total amount
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          amount: baseSalary + totalAdditions - totalDeductions,
          additions: { connect: additions.map((addition) => ({ id: addition.id })) },
          deductions: { connect: deductions.map((deduction) => ({ id: deduction.id })) },
          salaries: { connect: employeeAllowances.map((salary) => ({ id: salary.id })) },
        },
      });
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
