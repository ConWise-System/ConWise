import prisma from "../../config/prisma.js";

const normalizeTaskStatus = (status) => {
  if (!status) return "";
  return String(status).toLowerCase().replace(/[_\s]+/g, "");
};

const buildMilestoneAggregation = (project, tasks) => {
  const statusCounts = tasks.reduce(
    (acc, task) => {
      const normalizedStatus = normalizeTaskStatus(task.taskStatus);

      if (normalizedStatus === "approved") acc.completedTasks += 1;
      if (normalizedStatus === "inprogress") acc.inProgressTasks += 1;
      if (normalizedStatus === "underreview") acc.underReviewTasks += 1;
      if (normalizedStatus === "blocked") acc.blockedTasks += 1;
      if (normalizedStatus === "rejected") acc.rejectedTasks += 1;

      return acc;
    },
    {
      completedTasks: 0,
      inProgressTasks: 0,
      underReviewTasks: 0,
      blockedTasks: 0,
      rejectedTasks: 0,
    },
  );

  const totalTasks = tasks.length;
  const completionPercentage =
    totalTasks === 0 ? 0 : (statusCounts.completedTasks / totalTasks) * 100;

  return {
    projectId: String(project.id),
    projectName: project.projectName,
    projectStartDate: project.startDate,
    projectDueDate: project.endDate,
    ...statusCounts,
    totalTasks,
    completionPercentage,
  };
};

export const milestoneService = {
  getProjectMilestones: async (projectId) => {
    const parsedProjectId = Number(projectId);

    const project = await prisma.project.findUnique({
      where: { id: parsedProjectId },
      select: {
        id: true,
        projectName: true,
        startDate: true,
        endDate: true,
      },
    });

    if (!project) {
      const error = new Error("Project not found");
      error.statusCode = 404;
      throw error;
    }

    const tasks = await prisma.task.findMany({
      where: { projectId: parsedProjectId },
      select: { taskStatus: true },
    });

    return buildMilestoneAggregation(project, tasks);
  },

  getTaskMilestoneByProject: async (projectId, taskId) => {
    const parsedProjectId = Number(projectId);
    const parsedTaskId = Number(taskId);

    const project = await prisma.project.findUnique({
      where: { id: parsedProjectId },
      select: {
        id: true,
        projectName: true,
      },
    });

    if (!project) {
      const error = new Error("Project not found");
      error.statusCode = 404;
      throw error;
    }

    const task = await prisma.task.findFirst({
      where: {
        id: parsedTaskId,
        projectId: parsedProjectId,
      },
      select: {
        id: true,
        taskTitle: true,
        startDate: true,
        dueDate: true,
        taskStatus: true,
      },
    });

    if (!task) {
      const error = new Error("Task not found for the given project");
      error.statusCode = 404;
      throw error;
    }

    return {
      projectId: String(project.id),
      taskId: String(task.id),
      projectName: project.projectName,
      taskName: task.taskTitle,
      taskStartDate: task.startDate,
      taskDueDate: task.dueDate,
      taskStatus: task.taskStatus,
    };
  },
};
