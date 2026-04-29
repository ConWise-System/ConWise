/*
Warnings:

- You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
- You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
- You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PLATFORM_ADMIN', 'COMPANY_ADMIN', 'PROJECT_MANAGER', 'SITE_ENGINEER', 'SITE_SUPERVISOR');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING_VERIFICATION', 'ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('EMAIL_VERIFICATION', 'PHONE_VERIFICATION', 'PASSWORD_RESET', 'INVITE');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED');

-- CreateEnum (was missing — caused TaskPriority does not exist error)
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum (was missing)
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'BLOCKED', 'DONE');

-- CreateEnum
CREATE TYPE "IssueStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum (new — for BE-PROJ-08)
CREATE TYPE "IssuePriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('DAILY_SITE_REPORT', 'PROGRESS_REPORT', 'INCIDENT_REPORT', 'QUALITY_REPORT');

-- CreateEnum
CREATE TYPE "NotificationEntityType" AS ENUM ('PROJECT', 'TASK', 'REPORT', 'ISSUE', 'MESSAGE', 'USER');

-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('TEXT', 'IMAGE', 'FILE', 'SYSTEM');

-- DropForeignKey (only if old tables exist — safe to run even if they don't)
ALTER TABLE IF EXISTS "Task"
DROP CONSTRAINT IF EXISTS "Task_projectId_fkey";

ALTER TABLE IF EXISTS "Task"
DROP CONSTRAINT IF EXISTS "Task_taskAssigneeID_fkey";

-- DropTable
DROP TABLE IF EXISTS "Project";

DROP TABLE IF EXISTS "Task";

DROP TABLE IF EXISTS "User";

-- CreateTable
CREATE TABLE "companies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "status" "CompanyStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER,
    "role" "UserRole" NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "bio" TEXT,
    "passwordHash" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "deviceInfo" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_codes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "type" "VerificationType" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "verification_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "ownerUserId" INTEGER NOT NULL,
    "projectName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "clientName" TEXT NOT NULL,
    "projectBudget" DECIMAL(15, 2) NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_progress" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "completionPercentage" DECIMAL(5, 2) NOT NULL,
    "totalTasks" INTEGER NOT NULL,
    "tasksCompleted" INTEGER NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "project_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "assigneeUserId" INTEGER NOT NULL,
    "materialUsedId" INTEGER,
    "taskTitle" TEXT NOT NULL,
    "taskDescription" TEXT,
    "startDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3) NOT NULL,
    "taskBudget" DECIMAL(15, 2) NOT NULL,
    "taskPriority" "TaskPriority" NOT NULL,
    "taskStatus" "TaskStatus" NOT NULL DEFAULT 'TODO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_progress" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "daysRemaining" INTEGER NOT NULL,
    "deadlineStatus" TEXT NOT NULL,
    "taskStatus" "TaskStatus" NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "task_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materials_used" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "materialName" TEXT NOT NULL,
    "quantityUsed" DECIMAL(10, 2) NOT NULL,
    "unit" TEXT NOT NULL,
    "usageDescription" TEXT,
    "materialStatus" TEXT NOT NULL,
    CONSTRAINT "materials_used_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cost_summaries" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "estimatedCost" DECIMAL(15, 2) NOT NULL,
    "actualTaskCost" DECIMAL(15, 2) NOT NULL,
    "costVariance" DECIMAL(15, 2) NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cost_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "reportTitle" TEXT NOT NULL,
    "reportType" "ReportType" NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL,
    "workCompleted" TEXT NOT NULL,
    "progressPhotoUrl" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "recipientUserId" INTEGER NOT NULL,
    "notificationTitle" TEXT NOT NULL,
    "notificationDescription" TEXT,
    "notifiedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "relatedEntityType" "NotificationEntityType" NOT NULL,
    "relatedEntityId" INTEGER NOT NULL,
    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable: new Issue model (BE-PROJ-08)

CREATE TABLE "issues" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "reporterId" INTEGER NOT NULL,
    "assigneeId" INTEGER,
    "blockedTaskId" INTEGER,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL,
    "location" VARCHAR(200),
    "priority" "IssuePriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "IssueStatus" NOT NULL DEFAULT 'OPEN',
    "photoUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "resolvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable: audit log (BE-PROJ-08)
CREATE TABLE "issue_audit_logs" (
    "id" SERIAL NOT NULL,
    "issueId" INTEGER NOT NULL,
    "actorId" INTEGER NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "fromValue" TEXT,
    "toValue" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "issue_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chats" (
    "id" SERIAL NOT NULL,
    "senderUserId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "messageContent" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chatType" "ChatType" NOT NULL DEFAULT 'TEXT',
    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_email_key" ON "companies" ("email");

CREATE UNIQUE INDEX "companies_phone_key" ON "companies" ("phone");

CREATE INDEX "companies_name_idx" ON "companies" ("name");

CREATE UNIQUE INDEX "users_email_key" ON "users" ("email");

CREATE UNIQUE INDEX "users_phone_key" ON "users" ("phone");

CREATE INDEX "users_companyId_idx" ON "users" ("companyId");

CREATE INDEX "users_role_idx" ON "users" ("role");

CREATE INDEX "users_status_idx" ON "users" ("status");

CREATE INDEX "sessions_userId_idx" ON "sessions" ("userId");

CREATE INDEX "sessions_expiresAt_idx" ON "sessions" ("expiresAt");

CREATE INDEX "verification_codes_userId_type_idx" ON "verification_codes" ("userId", "type");

CREATE INDEX "verification_codes_expiresAt_idx" ON "verification_codes" ("expiresAt");

CREATE INDEX "projects_companyId_idx" ON "projects" ("companyId");

CREATE INDEX "projects_ownerUserId_idx" ON "projects" ("ownerUserId");

CREATE UNIQUE INDEX "project_progress_projectId_key" ON "project_progress" ("projectId");

CREATE INDEX "tasks_projectId_idx" ON "tasks" ("projectId");

CREATE INDEX "tasks_assigneeUserId_idx" ON "tasks" ("assigneeUserId");

CREATE UNIQUE INDEX "task_progress_taskId_key" ON "task_progress" ("taskId");

CREATE UNIQUE INDEX "cost_summaries_projectId_key" ON "cost_summaries" ("projectId");

CREATE INDEX "reports_userId_idx" ON "reports" ("userId");

CREATE INDEX "reports_projectId_idx" ON "reports" ("projectId");

CREATE INDEX "notifications_recipientUserId_isRead_idx" ON "notifications" ("recipientUserId", "isRead");

CREATE INDEX "issues_companyId_idx" ON "issues" ("companyId");

CREATE INDEX "issues_projectId_idx" ON "issues" ("projectId");

CREATE INDEX "issues_assigneeId_idx" ON "issues" ("assigneeId");

CREATE INDEX "issues_status_idx" ON "issues" ("status");

CREATE INDEX "issue_audit_logs_issueId_idx" ON "issue_audit_logs" ("issueId");

CREATE INDEX "chats_senderUserId_idx" ON "chats" ("senderUserId");

CREATE INDEX "chats_projectId_idx" ON "chats" ("projectId");

-- AddForeignKey
ALTER TABLE "users"
ADD CONSTRAINT "users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "sessions"
ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "verification_codes"
ADD CONSTRAINT "verification_codes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "projects"
ADD CONSTRAINT "projects_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "projects"
ADD CONSTRAINT "projects_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "project_progress"
ADD CONSTRAINT "project_progress_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tasks"
ADD CONSTRAINT "tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tasks"
ADD CONSTRAINT "tasks_assigneeUserId_fkey" FOREIGN KEY ("assigneeUserId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "tasks"
ADD CONSTRAINT "tasks_materialUsedId_fkey" FOREIGN KEY ("materialUsedId") REFERENCES "materials_used" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "task_progress"
ADD CONSTRAINT "task_progress_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "materials_used"
ADD CONSTRAINT "materials_used_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "cost_summaries"
ADD CONSTRAINT "cost_summaries_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "reports"
ADD CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "reports"
ADD CONSTRAINT "reports_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "notifications"
ADD CONSTRAINT "notifications_recipientUserId_fkey" FOREIGN KEY ("recipientUserId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "issues"
ADD CONSTRAINT "issues_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "issues"
ADD CONSTRAINT "issues_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "issues"
ADD CONSTRAINT "issues_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "issues"
ADD CONSTRAINT "issues_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "issues"
ADD CONSTRAINT "issues_blockedTaskId_fkey" FOREIGN KEY ("blockedTaskId") REFERENCES "tasks" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "issue_audit_logs"
ADD CONSTRAINT "issue_audit_logs_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "issues" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "issue_audit_logs"
ADD CONSTRAINT "issue_audit_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "chats"
ADD CONSTRAINT "chats_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "chats"
ADD CONSTRAINT "chats_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE;