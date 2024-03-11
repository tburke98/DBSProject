-- CreateTable
CREATE TABLE "RentCost" (
    "year" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 2000,
    "cost" DECIMAL NOT NULL
);

-- CreateTable
CREATE TABLE "MonthlyExpense" (
    "year" INTEGER NOT NULL DEFAULT 2000,
    "month" INTEGER NOT NULL DEFAULT 1,
    "electricity" DECIMAL NOT NULL,
    "water" DECIMAL NOT NULL,
    "heat" DECIMAL NOT NULL,

    PRIMARY KEY ("year", "month"),
    CONSTRAINT "MonthlyExpense_year_fkey" FOREIGN KEY ("year") REFERENCES "RentCost" ("year") ON DELETE RESTRICT ON UPDATE CASCADE
);
