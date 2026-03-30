import { PrismaClient } from "../../generated/prisma/index.js";
import { ROLES } from "../../config/constants.js";

const prisma = new PrismaClient();

// Helper to serialize Decimal fields to plain numbers
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
          startDate: new Date(projectData.startDate),
          endDate: projectData.endDate ? new Date(projectData.endDate) : null,
          clientName: projectData.clientName,
          projectBudget: projectData.projectBudget,
          status: projectData.status ?? "PLANNING",
        },
      });

      // Step 2: Initialize ProjectProgress automatically
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

  // List projects — SITE_ENGINEER and SITE_SUPERVISOR only see
  // projects they are assigned to via tasks
  getAllProjects: async ({ companyId, userId, role }) => {
    let where = { companyId };

    // Site Engineer and Supervisor only see projects
    // where they have been assigned tasks
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

  // Get single project — Site Engineer and Supervisor
  // can only view projects they are assigned to
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
};
