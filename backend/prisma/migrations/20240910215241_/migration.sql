/*
  Warnings:

  - You are about to drop the column `value` on the `Salary` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `SalaryAdjustment` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Salary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `SalaryAdjustment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Salary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "amount" REAL NOT NULL,
    "salaryTypeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Salary_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Salary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Salary_salaryTypeId_fkey" FOREIGN KEY ("salaryTypeId") REFERENCES "SalaryType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Salary" ("createdAt", "employeeId", "id", "month", "salaryTypeId", "updatedAt", "userId", "year") SELECT "createdAt", "employeeId", "id", "month", "salaryTypeId", "updatedAt", "userId", "year" FROM "Salary";
DROP TABLE "Salary";
ALTER TABLE "new_Salary" RENAME TO "Salary";
CREATE TABLE "new_SalaryAdjustment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "formula" TEXT,
    "variables" TEXT,
    "isEndOfService" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SalaryAdjustment" ("createdAt", "description", "formula", "id", "isEndOfService", "name", "type", "updatedAt", "variables") SELECT "createdAt", "description", "formula", "id", "isEndOfService", "name", "type", "updatedAt", "variables" FROM "SalaryAdjustment";
DROP TABLE "SalaryAdjustment";
ALTER TABLE "new_SalaryAdjustment" RENAME TO "SalaryAdjustment";
CREATE TABLE "new_Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "isEndOfService" BOOLEAN NOT NULL DEFAULT false,
    "amount" REAL NOT NULL,
    "dueDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "processDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Transaction_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("createdAt", "dueDate", "employeeId", "id", "isEndOfService", "processDate", "status", "updatedAt") SELECT "createdAt", "dueDate", "employeeId", "id", "isEndOfService", "processDate", "status", "updatedAt" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
