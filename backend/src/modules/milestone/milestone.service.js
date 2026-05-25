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
  getMilestonesByManager: async (userId, companyId) => {

    // 1. Fetch ALL projects owned by this Project Manager within their company
    const projects = await prisma.project.findMany({
      where: { 
        ownerUserId: userId,
        companyId: companyId 
      },
      include: {
        tasks: {
          select: {
            id: true,
            taskTitle: true,
            taskStatus: true,
            startDate: true,
            dueDate: true,
          }
        },
        projectProgress: true 
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!projects || projects.length === 0) {
      const error = new Error("No active managed projects found associated with your profile.");
      error.statusCode = 404;
      throw error;
    }

    // 2. Map over EVERY project in the array to aggregate metrics dynamically
    const projectsWithMilestones = projects.map((project) => {
      const totalTasks = project.tasks.length;
      const todoTasks = project.tasks.filter(t => t.taskStatus === "TODO").length;
      const inProgressTasks = project.tasks.filter(t => t.taskStatus === "IN_PROGRESS").length;
      const doneTasks = project.tasks.filter(t => t.taskStatus === "DONE").length;
      const blockedTasks = project.tasks.filter(t => t.taskStatus === "BLOCKED").length;

      const completionPercentage = totalTasks > 0 
        ? Math.round((doneTasks / totalTasks) * 100) 
        : 0;

      // Map tasks to structural milestone progress tracker objects
      const dynamicMilestones = project.tasks.map((task) => {
        return {
          milestoneId: task.id.toString(),
          milestoneName: task.taskTitle,
          milestoneDueDate: task.dueDate,
          totalTasks: 1,
          inProgressTasks: task.taskStatus === "IN_PROGRESS" ? 1 : 0,
          doneTasks: task.taskStatus === "DONE" ? 1 : 0,
          todoTasks: task.taskStatus === "TODO" ? 1 : 0,
          completionPercentage: task.taskStatus === "DONE" ? 100 : task.taskStatus === "IN_PROGRESS" ? 50 : 0
        };
      });

      return {
        projectId: project.id.toString(),
        projectName: project.projectName,
        projectStartDate: project.startDate,
        projectDueDate: project.endDate,
        completedTasks: doneTasks,
        inProgressTasks: inProgressTasks,
        "Done tasks": doneTasks, // Kept exactly as your format request string specifies
        totalTasks: totalTasks,
        completionPercentage: completionPercentage,
        milestones: dynamicMilestones // Passed to frontend loops for individual bars
      };
    });

    // 3. Return the entire array of processed projects
    return projectsWithMilestones;
  },
};

//  getTaskMilestoneByProject: async (projectId, taskId) => {
//     const parsedProjectId = Number(projectId);
//     const parsedTaskId = Number(taskId);

//     const project = await prisma.project.findUnique({
//       where: { id: parsedProjectId },
//       select: {
//         id: true,
//         projectName: true,
//       },
//     });

//     if (!project) {
//       const error = new Error("Project not found");
//       error.statusCode = 404;
//       throw error;
//     }

//     const task = await prisma.task.findFirst({
//       where: {
//         id: parsedTaskId,
//         projectId: parsedProjectId,
//       },
//       select: {
//         id: true,
//         taskTitle: true,
//         startDate: true,
//         dueDate: true,
//         taskStatus: true,
//       },
//     });

//     if (!task) {
//       const error = new Error("Task not found for the given project");
//       error.statusCode = 404;
//       throw error;
//     }

//     return {
//       projectId: String(project.id),
//       taskId: String(task.id),
//       projectName: project.projectName,
//       taskName: task.taskTitle,
//       taskStartDate: task.startDate,
//       taskDueDate: task.dueDate,
//       taskStatus: task.taskStatus,
//     };
//   },
