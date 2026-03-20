import prisma from "../../config/prisma.js";

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

  // List all projects belonging to the user's company
  getAllProjects: async ({ companyId }) => {
    const projects = await prisma.project.findMany({
      where: { companyId },
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

  // Get single project by ID with full details
  getProjectById: async ({ projectId, companyId }) => {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        companyId,
      },
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
