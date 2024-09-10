/*
  Warnings:

  - Added the required column `amount` to the `Addition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Deduction` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Addition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reasonId" TEXT NOT NULL,
    "transactionId" TEXT,
    "amount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Addition_reasonId_fkey" FOREIGN KEY ("reasonId") REFERENCES "SalaryAdjustment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Addition_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Addition" ("createdAt", "id", "reasonId", "transactionId", "updatedAt") SELECT "createdAt", "id", "reasonId", "transactionId", "updatedAt" FROM "Addition";
DROP TABLE "Addition";
ALTER TABLE "new_Addition" RENAME TO "Addition";
CREATE TABLE "new_Deduction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reasonId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Deduction_reasonId_fkey" FOREIGN KEY ("reasonId") REFERENCES "SalaryAdjustment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Deduction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Deduction" ("createdAt", "id", "reasonId", "transactionId", "updatedAt") SELECT "createdAt", "id", "reasonId", "transactionId", "updatedAt" FROM "Deduction";
DROP TABLE "Deduction";
ALTER TABLE "new_Deduction" RENAME TO "Deduction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
