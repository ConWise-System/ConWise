import prisma from "../../config/prisma.js";
import { ROLES } from "../../config/constants.js";
import * as notificationService from "../notification/notification.service.js";

// Helper to parse and validate dates
const parseDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date value: ${value}`);
  }
  return date;
};

// Helper to serialize all Decimal fields to strings for JSON response
const serializeProject = (project) => ({
  ...project,
  projectBudget: project.projectBudget?.toString(),
  projectProgress: project.projectProgress
    ? {
        ...project.projectProgress,
        completionPercentage:
          project.projectProgress.completionPercentage?.toString(),
      }
    : null,
  costSummary: project.costSummary
    ? {
        ...project.costSummary,
        estimatedCost: project.costSummary.estimatedCost?.toString(),
        actualTaskCost: project.costSummary.actualTaskCost?.toString(),
        costVariance: project.costSummary.costVariance?.toString(),
      }
    : null,
});

export const projectService = {
  // Create project + initialize ProjectProgress in a single transaction
  createProject: async ({ ownerUserId, companyId, projectData }) => {
    const result = await prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: {
          ownerUserId,
          companyId,
          projectName: projectData.projectName,
          location: projectData.location,
          startDate: parseDate(projectData.startDate),
          endDate: projectData.endDate ? parseDate(projectData.endDate) : null,
          clientName: projectData.clientName,
          projectBudget: projectData.projectBudget,
          status: projectData.status ?? "PLANNING",
        },
      });

      // Automatically initialize ProjectProgress at 0
      // Guarantees the analytics dashboard always has a record to read
      const progress = await tx.projectProgress.create({
        data: {
          projectId: project.id,
          completionPercentage: 0,
          totalTasks: 0,
          tasksCompleted: 0,
        },
      });

      return { ...project, projectProgress: progress };
    });

    // send notification to admin of the company the project is created under

    try {
      // find company id
      const companyAdmin = await prisma.user.findFirst({
        where: {
          companyId: companyId,
          role: "COMPANY_ADMIN",
        },
        select: {
          id: true,
        },
      });

      // 2. Only send if an admin exists
      if (companyAdmin) {
        await notificationService.createNotification({
          recipientUserId: companyAdmin.id,
          notificationTitle: "New Project Created",
          notificationDescription: `A new project "${result.projectName}" has been registered for your company.`,
          relatedEntityType: "PROJECT",
          relatedEntityId: result.id,
        });
      }
    } catch (err) {
      console.error("Notification failed in project service:", err.message);
    }

    return serializeProject(result);
  },

  // List projects — filtered by role
  getAllProjects: async ({ companyId, userId, role }) => {
    let where = { companyId };

    if (role === ROLES.SITE_ENGINEER || role === ROLES.SITE_SUPERVISOR) {
      where = {
        companyId,
        tasks: { some: { assigneeUserId: userId } },
      };
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        projectProgress: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return projects.map(serializeProject);
  },

  // Get single project — role-based visibility
 getAllProjects: async ({ companyId, userId, role }) => {
    let where = { companyId };

    if (role === ROLES.SITE_ENGINEER || role === ROLES.SITE_SUPERVISOR) {
      where = {
        companyId,
        tasks: { some: { assigneeUserId: userId } },
      };
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        projectProgress: true,
        // Pull only the status field to keep the query fast
        tasks: {
          select: { status: true }
        },
        _count: {
          select: { tasks: true }
        },
        owner: {
          select: { id: true, firstName: true, lastName: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const projectUpdatesToSync = [];

    const mappedProjects = projects.map(project => {
      const actualLiveCount = project._count?.tasks ?? 0;
      const tasks = project.tasks || [];
      
      let updatedStatus = project.status;

      // Rule: If there are tasks, and ALL of them are "DONE"
      if (tasks.length > 0 && tasks.every(task => task.status === "DONE")) {
        if (project.status !== "COMPLETED") {
          updatedStatus = "COMPLETED";
          // Queue the DB update for execution outside the main loop execution timeline
          projectUpdatesToSync.push(
            prisma.project.update({
              where: { id: project.id },
              data: { status: "COMPLETED" }
            }).catch(err => console.error(`Background sync failed for project ${project.id}:`, err))
          );
        }
      }

      // Override status structure on the object before serialization
      const serialized = serializeProject({ ...project, status: updatedStatus });
      
      if (!serialized.projectProgress) {
        serialized.projectProgress = {
          id: project.id,
          projectId: project.id,
          completionPercentage: "0",
          tasksCompleted: 0,
          lastUpdated: new Date().toISOString()
        };
      }
      
      serialized.projectProgress.totalTasks = actualLiveCount;
      
      // Clean up the tasks array so you don't leak it to the frontend response payload
      delete serialized.tasks;
      
      return serialized;
    });

    // Fire off all status updates to PostgreSQL in parallel without blocking the server response
    if (projectUpdatesToSync.length > 0) {
      Promise.all(projectUpdatesToSync);
    }

    return mappedProjects;
  },

  // Delete project
  // COMPANY_ADMIN: delete any project in their company
  // PROJECT_MANAGER: only projects they own
  // Cascade deletes: tasks, reports, issues, chats, projectProgress,
  // costSummary all removed automatically by Prisma schema rules
  //
  // FIX(CodeRabbit): TOCTOU race condition between findFirst and delete
  // Old approach: findFirst → check ownership → delete (3 separate ops)
  // Problem: another request could delete the project between findFirst
  //          and the delete call, causing P2025 or wrong authorization
  // Fix: use prisma.$transaction() to make the read + authorization +
  //      delete atomic — no other operation can interleave
  deleteProject: async ({ projectId, companyId, userId, role }) => {
    try {
      const deletedProject = await prisma.$transaction(async (tx) => {
        // Read and authorize inside the transaction — atomic
        const project = await tx.project.findFirst({
          where: { id: projectId, companyId },
        });

        if (!project) return null;

        // Whitelist authorization check
        if (role === ROLES.COMPANY_ADMIN) {
          // Full access — no ownership check needed
        } else if (role === ROLES.PROJECT_MANAGER) {
          if (project.ownerUserId !== userId) {
            const error = new Error("You can only delete projects you own.");
            error.statusCode = 403;
            throw error;
          }
        } else {
          const error = new Error(
            "You do not have permission to delete this project.",
          );
          error.statusCode = 403;
          throw error;
        }

        // Delete inside the same transaction — atomic with the read above
        await tx.project.delete({ where: { id: projectId } });

        return { id: projectId, projectName: project.projectName };
      });

      // Send notification to company admins
      try {
        const companyAdmin = await prisma.user.findFirst({
          where: {
            companyId: companyId,
            role: "COMPANY_ADMIN",
          },
          select: {
            id: true,
          },
        });

        if (companyAdmin) {
          await notificationService.createNotification({
            recipientUserId: companyAdmin.id,
            notificationTitle: "Project Deleted",
            notificationDescription: `Project "${deletedProject.projectName}" has been deleted.`,
            relatedEntityType: "PROJECT",
            relatedEntityId: companyId,
          });
        }
      } catch (error) {
        // Notification failures don't block project deletion
        console.error(
          "Notification failed in project deletion service",
          error.message,
        );
      }

      return deletedProject;
    } catch (error) {
      // P2025: record not found during delete (concurrent deletion)
      // Treat as not found rather than crashing
      if (error.code === "P2025") return null;
      throw error;
    }
  },
};
