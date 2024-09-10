import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

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
      {
        name: "Overtime",
        description: "Additional pay for overtime work",
        value: 0,
        formula: "hourlyRate * 1.25 * overtimeHours",
      },
      {
        name: "End of Service Gratuity",
        description: "Gratuity based on UAE labor law",
        value: 0,
        formula:
          "IF(yearsOfService < 5, basicSalary * yearsOfService * (21/30), basicSalary * 5 * (21/30) + basicSalary * (yearsOfService - 5) * (30/30))",
        isEndOfService: true,
      },
      {
        name: "Sick Leave Deduction",
        description: "Deduction for unpaid sick leave",
        value: 0,
        formula: "dailySalary * unpaidSickDays",
      },
      {
        name: "Performance Bonus",
        description: "Bonus based on employee performance",
        value: 0,
        formula: "basicSalary * performanceMultiplier",
      },
      {
        name: "Sales Commission",
        description: "Commission for sales achievements",
        value: 0,
        formula: "salesAmount * commissionRate",
      },
      {
        name: "Night Shift Allowance",
        description: "Additional pay for night shift work",
        value: 300,
      },
      {
        name: "Holiday Pay",
        description: "Extra pay for working on holidays",
        value: 0,
        formula: "holidayHours * holidayRate",
      },
      {
        name: "Travel Allowance",
        description: "Allowance for business travel expenses",
        value: 250,
      },
      {
        name: "Education Allowance",
        description: "Allowance for employee education or training",
        value: 400,
      },
      {
        name: "Relocation Bonus",
        description: "One-time bonus for relocating employees",
        value: 0,
        formula: "basicSalary * relocationMultiplier",
      },
      {
        name: "Retention Bonus",
        description: "Bonus to retain valuable employees",
        value: 0,
        formula: "yearsOfService * retentionRate",
      },
      {
        name: "Shift Differential",
        description: "Additional pay for non-standard shifts",
        value: 0,
        formula: "shiftHours * shiftDifferentialRate",
      },
      {
        name: "Referral Bonus",
        description: "Bonus for referring new hires",
        value: 0,
        formula: "referralBonus * successfulReferrals",
      },
      {
        name: "Attendance Bonus",
        description: "Bonus for perfect attendance",
        value: 0,
        formula: "IF(perfectAttendance, attendanceBonus, 0)",
      },
      {
        name: "Project Completion Bonus",
        description: "Bonus for completing projects on time",
        value: 0,
        formula: "projectValue * completionBonusRate",
      },
      {
        name: "Language Proficiency Bonus",
        description: "Bonus for multilingual skills",
        value: 0,
        formula: "languageProficiencyLevel * languageBonusRate",
      },
      {
        name: "Certification Bonus",
        description: "Bonus for obtaining professional certifications",
        value: 0,
        formula: "certificationLevel * certificationBonusRate",
      },
      {
        name: "On-Call Pay",
        description: "Compensation for being on-call",
        value: 0,
        formula: "onCallHours * onCallRate",
      },
      {
        name: "Meal Allowance Deduction",
        description: "Deduction for provided meals",
        value: 0,
        formula: "mealCost * providedMeals",
      },
      {
        name: "Uniform Deduction",
        description: "Deduction for provided uniforms",
        value: 0,
        formula: "uniformCost / payPeriods",
      },
    ],
  });

  // Generate employees
  for (let i = 0; i < 10; i++) {
    const employee = await prisma.employee.create({
      data: {
        staffId: faker.string.alphanumeric(8).toUpperCase(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        position: faker.person.jobTitle(),
        joiningDate: faker.date.past(),
        userId: user.id,
      },
    });

    // Generate salaries for the employee
    for (let month = 1; month <= 12; month++) {
      await prisma.salary.create({
        data: {
          employeeId: employee.id,
          userId: user.id,
          month,
          year: 2023,
          value: faker.number.float({ min: 3000, max: 15000, precision: 2 }),
          salaryTypeId: (await prisma.salaryType.findFirst()).id,
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
