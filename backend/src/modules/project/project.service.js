import prisma from "../../config/prisma.js";
import { ROLES } from "../../config/constants.js";

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
  getProjectById: async ({ projectId, companyId, userId, role }) => {
    let where = { id: projectId, companyId };

    if (role === ROLES.SITE_ENGINEER || role === ROLES.SITE_SUPERVISOR) {
      where = {
        id: projectId,
        companyId,
        tasks: { some: { assigneeUserId: userId } },
      };
    }

    const project = await prisma.project.findFirst({
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
        costSummary: true,
        _count: {
          select: { tasks: true, issues: true, reports: true },
        },
      },
    });

    if (!project) return null;
    return serializeProject(project);
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

      return deletedProject;
    } catch (error) {
      // P2025: record not found during delete (concurrent deletion)
      // Treat as not found rather than crashing
      if (error.code === "P2025") return null;
      throw error;
    }
  },
};
