// src/modules/issue/issue.service.js
import prisma from "../../config/prisma.js";
import { ROLES } from "../../config/constants.js";
import * as notificationService from "../notification/notification.service.js";

// ─── State machine: valid transitions ────────────────────────────────────────
// OPEN → IN_PROGRESS → RESOLVED → CLOSED
// RESOLVED → IN_PROGRESS (re-open if resolution fails verification)
const VALID_TRANSITIONS = {
  OPEN: ["IN_PROGRESS"],
  IN_PROGRESS: ["RESOLVED"],
  RESOLVED: ["CLOSED", "IN_PROGRESS"],
  CLOSED: [],
};

const isValidTransition = (from, to) =>
  VALID_TRANSITIONS[from]?.includes(to) ?? false;

// ─── Role permissions ─────────────────────────────────────────────────────────
const CAN_CLOSE = [ROLES.COMPANY_ADMIN, ROLES.PROJECT_MANAGER];
const CAN_ASSIGN = [
  ROLES.COMPANY_ADMIN,
  ROLES.PROJECT_MANAGER,
  ROLES.SITE_ENGINEER,
];
const CAN_CREATE = [
  ROLES.COMPANY_ADMIN,
  ROLES.PROJECT_MANAGER,
  ROLES.SITE_ENGINEER,
  ROLES.SITE_SUPERVISOR,
];

// ─── Helper: parse positive integer (shared with controller) ─────────────────
const parsePositiveInt = (value, fieldName) => {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) {
    const err = new Error(`${fieldName} must be a positive integer`);
    err.statusCode = 400;
    throw err;
  }
  return n;
};

// ─── Helper: write an audit log entry (internal) ─────────────────────────────
const writeAuditLog = async (
  tx,
  { issueId, actorId, action, fromValue, toValue, note },
) => {
  return tx.issueAuditLog.create({
    data: {
      issueId,
      actorId,
      action,
      fromValue: fromValue ?? null,
      toValue: toValue ?? null,
      note: note ?? null,
    },
  });
};

// ─── Issue service ────────────────────────────────────────────────────────────
export const issueService = {
  // ── Create a new issue ──────────────────────────────────────────────────────
  createIssue: async ({ projectId, reporterId, companyId, data, userRole }) => {
    if (!CAN_CREATE.includes(userRole)) {
      const err = new Error("You do not have permission to create issues");
      err.statusCode = 403;
      throw err;
    }

    // Verify project belongs to this company
    const projectCheck = await prisma.project.findFirst({
      where: { id: projectId, companyId },
    });
    if (!projectCheck) {
      const err = new Error("Project not found or access denied");
      err.statusCode = 404;
      throw err;
    }

    // Verification for blocked task...
    if (data.blockedTaskId) {
      const task = await prisma.task.findFirst({
        where: { id: data.blockedTaskId, projectId },
      });
      if (!task) {
        const err = new Error("Task not found in this project");
        err.statusCode = 404;
        throw err;
      }
    }

    // 1. Capture the result of the transaction
    const newIssue = await prisma.$transaction(async (tx) => {
      const issue = await tx.issue.create({
        data: {
          companyId,
          projectId,
          reporterId,
          title: data.title,
          description: data.description,
          priority: data.priority ?? "MEDIUM",
          location: data.location ?? null,
          photoUrls: data.photoUrls ?? [],
          blockedTaskId: data.blockedTaskId ?? null,
          status: "OPEN",
        },
        include: {
          reporter: {
            select: { id: true, firstName: true, lastName: true, role: true },
          },
          project: {
            select: {
              id: true,
              projectName: true,
              ownerUserId: true, // CRITICAL: Need this for notification recipient
            },
          },
        },
      });

      await writeAuditLog(tx, {
        issueId: issue.id,
        actorId: reporterId,
        action: "CREATED",
        toValue: "OPEN",
        note: `Issue created with priority ${issue.priority}`,
      });

      return issue;
    });

    // 2. Notify Project Manager (Now outside the transaction and before the final return)
    try {
      if (newIssue.project?.ownerUserId) {
        await notificationService.createNotification({
          recipientUserId: newIssue.project?.ownerUserId,
          notificationTitle: "🚨 New Issue Reported",
          notificationDescription: `${newIssue.reporter.firstName} reported: "${newIssue.title}" in ${newIssue.project.projectName}`,
          relatedEntityType: "ISSUE",
          relatedEntityId: newIssue.id,
        });
      }
    } catch (err) {
      console.error("Notification failed in createIssue:", err.message);
    }

    // 3. Final return
    return newIssue;
  },
  // ── List issues (paginated + filtered) ─────────────────────────────────────
  listIssues: async ({ projectId, companyId, userRole, userId, query }) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(query.limit) || 20));
    const skip = (page - 1) * limit;

    const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };

    // Build where clause
    const where = { companyId, projectId };

    if (query.status) where.status = query.status;
    if (query.priority) where.priority = query.priority;

    // SITE_SUPERVISOR can only see issues they reported or are assigned to
    if (userRole === ROLES.SITE_SUPERVISOR) {
      where.OR = [{ reporterId: userId }, { assigneeId: userId }];
    }

    const [issues, total] = await Promise.all([
      prisma.issue.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ createdAt: "desc" }],
        include: {
          reporter: { select: { id: true, firstName: true, lastName: true } },
          assignee: { select: { id: true, firstName: true, lastName: true } },
          blockedTask: {
            select: { id: true, taskTitle: true, taskStatus: true },
          },
          _count: { select: { auditLogs: true } },
        },
      }),
      prisma.issue.count({ where }),
    ]);

    issues.sort((a, b) => {
      const priorityDiff =
        priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return {
      data: issues,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  getIssueByAssignee: async (userId) => {
    // Added return so the data is sent to the controller
    return await prisma.issue.findMany({
      where: {
        blockedTask: {
          assigneeUserId: parseInt(userId), // Ensure userId is an integer
        },
      },
      include: {
        reporter: {
          select: { firstName: true, lastName: true },
        },
        project: {
          select: { projectName: true },
        },
        blockedTask: {
          select: { taskTitle: true, taskStatus: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // ── Get single issue with audit trail ──────────────────────────────────────
  getIssue: async ({ issueId, projectId, companyId, userRole, userId }) => {
    const issue = await prisma.issue.findFirst({
      where: { id: issueId, projectId, companyId },
      include: {
        reporter: {
          select: { id: true, firstName: true, lastName: true, role: true },
        },
        assignee: {
          select: { id: true, firstName: true, lastName: true, role: true },
        },
        project: { select: { id: true, projectName: true } },
        blockedTask: {
          select: { id: true, taskTitle: true, taskStatus: true },
        },
        auditLogs: {
          orderBy: { createdAt: "asc" },
          include: {
            actor: {
              select: { id: true, firstName: true, lastName: true, role: true },
            },
          },
        },
      },
    });

    if (!issue) {
      const err = new Error("Issue not found");
      err.statusCode = 404;
      throw err;
    }

    // SITE_SUPERVISOR visibility check
    if (
      userRole === ROLES.SITE_SUPERVISOR &&
      issue.reporterId !== userId &&
      issue.assigneeId !== userId
    ) {
      const err = new Error("You do not have permission to view this issue");
      err.statusCode = 403;
      throw err;
    }

    return issue;
  },

  // ── Update issue metadata ────────────────────────────────────────────────────
  updateIssue: async ({
    issueId,
    projectId,
    companyId,
    actorId,
    userRole,
    data,
  }) => {
    // Whitelist updatable fields to prevent mass assignment
    const allowedFields = [
      "title",
      "description",
      "location",
      "priority",
      "photoUrls",
      "blockedTaskId",
    ];
    const updateData = {};
    for (const field of allowedFields) {
      if (data[field] !== undefined) updateData[field] = data[field];
    }

    return prisma.$transaction(async (tx) => {
      const issue = await tx.issue.findFirst({
        where: { id: issueId, projectId, companyId },
      });

      if (!issue) {
        const err = new Error("Issue not found");
        err.statusCode = 404;
        throw err;
      }

      if (
        updateData.blockedTaskId !== undefined &&
        updateData.blockedTaskId !== null
      ) {
        const task = await tx.task.findFirst({
          where: { id: updateData.blockedTaskId, projectId },
        });
        if (!task) {
          const err = new Error("Task not found in this project");
          err.statusCode = 404;
          throw err;
        }
      }

      if (issue.status === "CLOSED") {
        const err = new Error("Cannot edit a closed issue");
        err.statusCode = 409;
        throw err;
      }

      // SITE_SUPERVISOR can only edit their own reported issues
      if (userRole === ROLES.SITE_SUPERVISOR && issue.reporterId !== actorId) {
        const err = new Error("You can only edit issues you reported");
        err.statusCode = 403;
        throw err;
      }

      const updated = await tx.issue.update({
        where: { id: issueId },
        data: { ...updateData, updatedAt: new Date() },
        include: {
          reporter: { select: { id: true, firstName: true, lastName: true } },
          assignee: { select: { id: true, firstName: true, lastName: true } },
        },
      });

      if (data.priority && data.priority !== issue.priority) {
        await writeAuditLog(tx, {
          issueId,
          actorId,
          action: "PRIORITY_CHANGED",
          fromValue: issue.priority,
          toValue: data.priority,
        });
      }

      return updated;
    });
  },

  // ── Assign issue to a staff member ─────────────────────────────────────────
  assignIssue: async ({
    issueId,
    projectId,
    companyId,
    actorId,
    userRole,
    assigneeId,
    note,
  }) => {
    // 1. Validations (Permission & Existence)
    if (!CAN_ASSIGN.includes(userRole)) {
      const err = new Error("You do not have permission to assign issues");
      err.statusCode = 403;
      throw err;
    }

    const issue = await prisma.issue.findFirst({
      where: { id: issueId, projectId, companyId },
    });

    if (!issue) {
      const err = new Error("Issue not found");
      err.statusCode = 404;
      throw err;
    }

    if (issue.status === "CLOSED") {
      const err = new Error("Cannot assign a closed issue");
      err.statusCode = 409;
      throw err;
    }

    const assignee = await prisma.user.findFirst({
      where: { id: assigneeId, companyId },
      select: { id: true, firstName: true, lastName: true, role: true },
    });

    if (!assignee) {
      const err = new Error("Assignee not found in this company");
      err.statusCode = 404;
      throw err;
    }

    // 2. Transaction: Save the result to a variable instead of returning it immediately
    const transactionResult = await prisma.$transaction(
      async (tx) => {
        const previousAssigneeId = issue.assigneeId;

        const updated = await tx.issue.update({
          where: { id: issueId },
          data: { assigneeId, updatedAt: new Date() },
          include: {
            assignee: { select: { id: true, firstName: true, lastName: true } },
          },
        });

        await writeAuditLog(tx, {
          issueId,
          actorId,
          action: "ASSIGNED",
          fromValue: previousAssigneeId ? String(previousAssigneeId) : null,
          toValue: String(assigneeId),
          note: note ?? null,
        });

        return updated; // This return only exits the transaction block
      },
      {
        timeout: 15000, // Extended timeout for Neon database connections
      },
    );

    // 3. Notification: Now outside the transaction and reachable!
    try {
      await notificationService.createNotification({
        recipientUserId: assigneeId,
        notificationTitle: "🚨 Issue Assigned",
        notificationDescription: `You have been assigned to issue "${transactionResult.title}"`,
        relatedEntityType: "ISSUE",
        relatedEntityId: issueId,
      });
    } catch (error) {
      // We catch this so the API doesn't fail even if the notification server is slow
      console.error("Notification failed in assignIssue:", error.message);
    }

    // 4. Final Return for the entire function
    return { issue: transactionResult, assignee };
  },

  // ── Update status (state machine enforced) ──────────────────────────────────
  updateStatus: async ({
    issueId,
    companyId,
    actorId,
    userRole,
    newStatus,
    note,
  }) => {
    const issue = await prisma.issue.findFirst({
      where: { id: issueId, companyId },
    });

    if (!issue) {
      const err = new Error("Issue not found");
      err.statusCode = 404;
      throw err;
    }

    // Guard: only managers/admins can CLOSE
    if (newStatus === "CLOSED" && !CAN_CLOSE.includes(userRole)) {
      const err = new Error(
        "Only Project Managers and Admins can close issues",
      );
      err.statusCode = 403;
      throw err;
    }

    // Guard: state machine
    if (!isValidTransition(issue.status, newStatus)) {
      const err = new Error(
        `Invalid status transition: ${issue.status} → ${newStatus}. ` +
          `Allowed: ${VALID_TRANSITIONS[issue.status].join(", ") || "none (terminal state)"}`,
      );
      err.statusCode = 409;
      throw err;
    }

    const now = new Date();
    const timestamps = {};
    if (newStatus === "RESOLVED") timestamps.resolvedAt = now;
    if (newStatus === "CLOSED") timestamps.closedAt = now;
    if (newStatus === "IN_PROGRESS" && issue.status === "RESOLVED") {
      timestamps.resolvedAt = null;
    }

    // 1. Capture the transaction result
    const updatedIssue = await prisma.$transaction(
      async (tx) => {
        const updated = await tx.issue.update({
          where: { id: issueId },
          data: { status: newStatus, ...timestamps, updatedAt: now },
          include: {
            assignee: { select: { id: true, firstName: true, lastName: true } },
            reporter: { select: { id: true, firstName: true, lastName: true } },
            project: { select: { projectName: true, ownerUserId: true } }, // Include project info for the noti
          },
        });

        await writeAuditLog(tx, {
          issueId,
          actorId,
          action: "STATUS_CHANGED",
          fromValue: issue.status,
          toValue: newStatus,
          note: note ?? null,
        });

        return updated;
      },
      {
        timeout: 15000, // Handling potential Neon latency
      },
    );

    // 2. Send notification to relevant parties
    try {
      const recipients = new Set();

      // Use ?. to prevent "Cannot read properties of null" if assignee is null
      const reporterId = updatedIssue.reporter?.id;
      const assigneeId = updatedIssue.assignee?.id;

      if (reporterId && reporterId !== actorId) {
        recipients.add(reporterId);
      }

      // Only add if assigneeId exists (is not null)
      if (assigneeId && assigneeId !== actorId) {
        recipients.add(assigneeId);
      }

      for (const recipientId of recipients) {
        await notificationService.createNotification({
          recipientUserId: recipientId,
          notificationTitle: "🔄 Issue Status Updated",
          notificationDescription: `Issue "${updatedIssue.title}" changed from ${issue.status} to ${newStatus} in project ${updatedIssue.project.projectName}`,
          relatedEntityType: "ISSUE",
          relatedEntityId: issueId,
        });
      }
    } catch (error) {
      // This catch now correctly handles any remaining notification issues
      console.error("Notification failed in updateStatus:", error.message);
    }

    // 3. Final return
    return updatedIssue;
  },

  // ── Get audit trail only ────────────────────────────────────────────────────
  getAuditTrail: async ({
    issueId,
    projectId,
    companyId,
    userRole,
    userId,
  }) => {
    const issue = await prisma.issue.findFirst({
      where: { id: issueId, projectId, companyId },
      select: { id: true, reporterId: true, assigneeId: true },
    });

    if (!issue) {
      const err = new Error("Issue not found");
      err.statusCode = 404;
      throw err;
    }

    if (
      userRole === ROLES.SITE_SUPERVISOR &&
      issue.reporterId !== userId &&
      issue.assigneeId !== userId
    ) {
      const err = new Error("You do not have permission to view this issue");
      err.statusCode = 403;
      throw err;
    }

    return prisma.issueAuditLog.findMany({
      where: { issueId },
      orderBy: { createdAt: "asc" },
      include: {
        actor: {
          select: { id: true, firstName: true, lastName: true, role: true },
        },
      },
    });
  },

  // ── Delete issue (ADMIN only, only OPEN issues) ─────────────────────────────
  deleteIssue: async ({ issueId, companyId, userRole }) => {
    if (userRole !== ROLES.COMPANY_ADMIN) {
      const err = new Error("Only administrators can delete issues");
      err.statusCode = 403;
      throw err;
    }

    return prisma.$transaction(async (tx) => {
      const issue = await tx.issue.findFirst({
        where: { id: issueId, companyId },
        select: { status: true },
      });

      if (!issue) {
        const err = new Error("Issue not found");
        err.statusCode = 404;
        throw err;
      }

      if (issue.status !== "OPEN") {
        const err = new Error(
          `Cannot delete an issue that is ${issue.status}. Only OPEN issues can be deleted.`,
        );
        err.statusCode = 409;
        throw err;
      }

      await tx.issueAuditLog.deleteMany({ where: { issueId } });

      await tx.issue.deleteMany({
        where: { id: issueId, companyId, status: "OPEN" },
      });

      return { deleted: true, id: issueId };
    });
  },
};
