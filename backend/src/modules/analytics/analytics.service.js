import prisma from "../../config/prisma.js";
import { ROLES } from "../../config/constants.js";
import {
  TaskStatus,
  TaskPriority,
  IssueStatus,
} from "../../generated/prisma/index.js";

const getUtcDayBounds = (referenceDate = new Date()) => {
  const y = referenceDate.getUTCFullYear();
  const m = referenceDate.getUTCMonth();
  const d = referenceDate.getUTCDate();
  const startOfToday = new Date(Date.UTC(y, m, d, 0, 0, 0, 0));
  const startOfTomorrow = new Date(Date.UTC(y, m, d + 1, 0, 0, 0, 0));
  return { now: referenceDate, startOfToday, startOfTomorrow };
};

const round2 = (n) => Math.round(n * 100) / 100;

const mapTaskStatusCounts = (groups) => {
  const m = Object.fromEntries(
    groups.map((g) => [g.taskStatus, g._count._all]),
  );
  return {
    todo: m[TaskStatus.TODO] ?? 0,
    inProgress: m[TaskStatus.IN_PROGRESS] ?? 0,
    blocked: m[TaskStatus.BLOCKED] ?? 0,
    done: m[TaskStatus.DONE] ?? 0,
  };
};

const mapPriorityCounts = (groups) => {
  const m = Object.fromEntries(
    groups.map((g) => [g.taskPriority, g._count._all]),
  );
  return {
    low: m[TaskPriority.LOW] ?? 0,
    medium: m[TaskPriority.MEDIUM] ?? 0,
    high: m[TaskPriority.HIGH] ?? 0,
    critical: m[TaskPriority.CRITICAL] ?? 0,
  };
};

const mapIssueStatusCounts = (groups) => {
  const m = Object.fromEntries(groups.map((g) => [g.status, g._count._all]));
  return {
    open: m[IssueStatus.OPEN] ?? 0,
    inProgress: m[IssueStatus.IN_PROGRESS] ?? 0,
    resolved: m[IssueStatus.RESOLVED] ?? 0,
    closed: m[IssueStatus.CLOSED] ?? 0,
  };
};

// Progress is always derived from live task counts so analytics stays consistent
// with taskStats even when ProjectProgress row is missing or out of sync.
const buildProgressFromTaskStats = (taskStats) => {
  const totalTasks =
    taskStats.todo +
    taskStats.inProgress +
    taskStats.blocked +
    taskStats.done;
  const tasksCompleted = taskStats.done;
  const completionPercentage =
    totalTasks === 0 ? 0 : round2((tasksCompleted / totalTasks) * 100);

  return {
    completionPercentage,
    totalTasks,
    tasksCompleted,
    tasksRemaining: Math.max(0, totalTasks - tasksCompleted),
  };
};

export const analyticsService = {
  getProjectAnalytics: async ({ projectId, companyId, userId, role }) => {
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
      select: {
        id: true,
        projectName: true,
        status: true,
        startDate: true,
        endDate: true,
      },
    });

    if (!project) return null;

    const taskWhere = { projectId };
    const { now, startOfToday, startOfTomorrow } = getUtcDayBounds();

    const [
      taskStatusGroups,
      taskPriorityGroups,
      overdueTasks,
      dueToday,
      upcomingTasks,
      issueStatusGroups,
    ] = await Promise.all([
      prisma.task.groupBy({
        by: ["taskStatus"],
        where: taskWhere,
        _count: { _all: true },
      }),
      prisma.task.groupBy({
        by: ["taskPriority"],
        where: taskWhere,
        _count: { _all: true },
      }),
      prisma.task.count({
        where: {
          ...taskWhere,
          dueDate: { lt: now },
          taskStatus: { not: TaskStatus.DONE },
        },
      }),
      prisma.task.count({
        where: {
          ...taskWhere,
          dueDate: { gte: startOfToday, lt: startOfTomorrow },
        },
      }),
      prisma.task.count({
        where: {
          ...taskWhere,
          dueDate: { gte: startOfTomorrow },
        },
      }),
      prisma.issue.groupBy({
        by: ["status"],
        where: { projectId },
        _count: { _all: true },
      }),
    ]);

    const taskStats = mapTaskStatusCounts(taskStatusGroups);
    const priorityBreakdown = mapPriorityCounts(taskPriorityGroups);
    const issueStats = mapIssueStatusCounts(issueStatusGroups);
    const progress = buildProgressFromTaskStats(taskStats);

    return {
      projectId: project.id,
      projectName: project.projectName,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
      progress,
      taskStats,
      priorityBreakdown,
      timelineHealth: {
        overdueTasks,
        dueToday,
        upcomingTasks,
      },
      issueStats,
    };
  },

  getCostSummary: async ({ projectId, companyId, userId, role }) => {
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
    select: {
      id: true,
      projectName: true,
      projectBudget: true,
      costSummary: {
        select: {
          estimatedCost: true,
          costVariance: true,
        },
      },
    },
  });

  if (!project) return null;

  // ---- TASK COST (SUM) ----
  const taskCostAgg = await prisma.task.aggregate({
    where: { projectId },
    _sum: { taskBudget: true },
  });

  const taskCost = Number(taskCostAgg._sum.taskBudget || 0);
  const totalActualCost = taskCost;

  const projectBudget = Number(project.projectBudget || 0);
  const estimatedCost = Number(project.costSummary?.estimatedCost || 0);
  const costVariance = Number(project.costSummary?.costVariance || 0);

  // ---- VARIANCE STATUS ----
  let varianceStatus = "ON_BUDGET";
  if (costVariance > 0) varianceStatus = "UNDER_BUDGET";
  if (costVariance < 0) varianceStatus = "OVER_BUDGET";

  // ---- UTILIZATION ----
  const budgetUsedPercentage =
    projectBudget === 0
      ? 0
      : Math.round((totalActualCost / projectBudget) * 100 * 100) / 100;

  // ---- COST TREND (GROUP BY MONTH) ----
  const trendRaw = await prisma.task.groupBy({
    by: ["createdAt"],
    where: { projectId },
    _sum: { taskBudget: true },
    orderBy: { createdAt: "asc" },
  });

  const monthlyMap = {};

  trendRaw.forEach((item) => {
    const date = new Date(item.createdAt);
    const key = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}`;

    if (!monthlyMap[key]) {
      monthlyMap[key] = 0;
    }

    monthlyMap[key] += Number(item._sum.taskBudget || 0);
  });

  const costTrend = Object.entries(monthlyMap).map(([key, cost]) => {
    const [year, month] = key.split("-");
    return {
      date: `${year}-${month.padStart(2, "0")}`,
      cost: Math.round(cost * 100) / 100,
    };
  });

  return {
    projectId: project.id,

    budget: {
      projectBudget,
      estimatedCost,
    },

    actuals: {
      taskCost,
      totalActualCost,
    },

    variance: {
      costVariance,
      status: varianceStatus,
    },

    utilization: {
      budgetUsedPercentage,
    },

    costTrend,
  };
},
};
