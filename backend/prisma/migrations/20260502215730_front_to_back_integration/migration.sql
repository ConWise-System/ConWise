/*
  Warnings:

  - Added the required column `companyId` to the `reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `reports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "materials_used" ALTER COLUMN "taskId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "challenges" TEXT,
ADD COLUMN     "companyId" INTEGER NOT NULL,
ADD COLUMN     "materialsUsed" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "weatherCondition" TEXT,
ADD COLUMN     "workersPresent" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "reportType" SET DEFAULT 'DAILY_SITE_REPORT';

-- CreateIndex
CREATE INDEX "reports_companyId_idx" ON "reports"("companyId");

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
