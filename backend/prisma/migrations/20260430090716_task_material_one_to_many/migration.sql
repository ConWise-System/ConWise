/*
  Warnings:

  - You are about to drop the column `materialUsedId` on the `tasks` table. All the data in the column will be lost.
  - Added the required column `taskId` to the `materials_used` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "issues" DROP CONSTRAINT "issues_companyId_fkey";

-- DropForeignKey
ALTER TABLE "issues" DROP CONSTRAINT "issues_reporterId_fkey";

-- DropForeignKey
ALTER TABLE "materials_used" DROP CONSTRAINT "materials_used_companyId_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_materialUsedId_fkey";

-- AlterTable
ALTER TABLE "issues" ALTER COLUMN "reporterId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "materials_used" ADD COLUMN     "taskId" INTEGER NOT NULL,
ALTER COLUMN "companyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "materialUsedId";

-- CreateIndex
CREATE INDEX "issues_reporterId_idx" ON "issues"("reporterId");

-- CreateIndex
CREATE INDEX "materials_used_taskId_idx" ON "materials_used"("taskId");

-- AddForeignKey
ALTER TABLE "materials_used" ADD CONSTRAINT "materials_used_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materials_used" ADD CONSTRAINT "materials_used_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
