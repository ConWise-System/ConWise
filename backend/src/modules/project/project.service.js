import { PrismaClient } from "../../generated/prisma/index.js";
import { ROLES } from "../../config/constants.js";

const prisma = new PrismaClient();

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
      // Step 1: Create the project
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

      // Step 2: Automatically initialize ProjectProgress at 0
      // This guarantees the analytics dashboard always has a record to read
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
  // SITE_ENGINEER and SITE_SUPERVISOR only see projects
  // they are assigned to via tasks
  getAllProjects: async ({ companyId, userId, role }) => {
    let where = { companyId };

    if (role === ROLES.SITE_ENGINEER || role === ROLES.SITE_SUPERVISOR) {
      where = {
        companyId,
        tasks: {
          some: {
            assigneeUserId: userId,
          },
        },
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
        tasks: {
          some: {
            assigneeUserId: userId,
          },
        },
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
          select: {
            tasks: true,
            issues: true,
            reports: true,
          },
        },
      },
    });

    if (!project) return null;

    return serializeProject(project);
  },

  // Delete_project
  // COMPANY_ADMIN can delete any project in their company
  // PROJECT_MANAGER can only delete projects they own
  // Cascade deletes: tasks, reports, issues, chats,
  // projectProgress, costSummary are all removed automatically
  deleteProject: async ({ projectId, companyId, userId, role }) => {
    // First verify the project exists and belongs to the company
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        companyId,
      },
    });

    if (!project) return null;

    // Project Manager can only delete their own projects
    // AFTER — whitelist approach (gap closed)
    if (role === ROLES.COMPANY_ADMIN) {
      // COMPANY_ADMIN can delete any project in their company
      // no additional check needed — proceed to delete
    } else if (role === ROLES.PROJECT_MANAGER) {
      // PROJECT_MANAGER can only delete projects they own
      if (project.ownerUserId !== userId) {
        const error = new Error("You can only delete projects you own.");
        error.statusCode = 403;
        throw error;
      }
    } else {
      // Any other role that somehow bypasses route middleware
      // is explicitly denied here at the service level
      const error = new Error(
        "You do not have permission to delete this project.",
      );
      error.statusCode = 403;
      throw error;
    }

    // Delete the project — cascade handles all related records
    await prisma.project.delete({
      where: { id: projectId },
    });

    return {
      id: projectId,
      projectName: project.projectName,
    };
  },
};
