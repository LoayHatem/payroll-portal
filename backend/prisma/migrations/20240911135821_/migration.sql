/*
  Warnings:

  - You are about to drop the column `userId` on the `Salary` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Salary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "amount" REAL NOT NULL,
    "salaryTypeId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Salary_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Salary_salaryTypeId_fkey" FOREIGN KEY ("salaryTypeId") REFERENCES "SalaryType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Salary" ("amount", "createdAt", "employeeId", "id", "month", "salaryTypeId", "updatedAt", "year") SELECT "amount", "createdAt", "employeeId", "id", "month", "salaryTypeId", "updatedAt", "year" FROM "Salary";
DROP TABLE "Salary";
ALTER TABLE "new_Salary" RENAME TO "Salary";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
