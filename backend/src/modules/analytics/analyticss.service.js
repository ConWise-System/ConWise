import prisma from "../../config/prisma.js";

// ── Shared helper: progress for a list of project IDs ────────────────────────
async function getProjectsWithProgress(projectIds) {
  if (projectIds.length === 0) return {};

  const taskGroups = await prisma.task.groupBy({
    by: ["projectId", "taskStatus"],
    where: { projectId: { in: projectIds } },
    _count: { id: true },
  });

  const progressMap = {};
  for (const group of taskGroups) {
    const pid = group.projectId;
    if (!progressMap[pid]) progressMap[pid] = { total: 0, done: 0 };
    progressMap[pid].total += group._count.id;
    if (group.taskStatus === "APPROVED") {
      progressMap[pid].done += group._count.id;
    }
  }

  const result = {};
  for (const [pid, counts] of Object.entries(progressMap)) {
    result[pid] = {
      totalTasks: counts.total,
      doneTasks: counts.done,
      progressPercent:
        counts.total === 0 ? 0 : Math.round((counts.done / counts.total) * 100),
    };
  }
  return result;
}

// ── Shared helper: cost summary for a list of project IDs ────────────────────
async function getProjectsCostSummary(projectIds) {
  if (projectIds.length === 0) return {};

  const taskBudgets = await prisma.task.groupBy({
    by: ["projectId"],
    where: { projectId: { in: projectIds } },
    _sum: { taskBudget: true },
  });

  const costMap = {};
  for (const row of taskBudgets) {
    costMap[row.projectId] = Number(row._sum.taskBudget ?? 0);
  }
  return costMap;
}

// ── Shared helper: groupBy result → clean map ─────────────────────────────────
function groupByToMap(groupByResult, statusField) {
  return groupByResult.reduce((acc, row) => {
    acc[row[statusField]] = row._count.id;
    return acc;
  }, {});
}

// ── Main entry point ──────────────────────────────────────────────────────────
const getDashboardSummary = async ({ userId, companyId, userRole }) => {
  switch (userRole) {
    case "COMPANY_ADMIN":
      return getAdminDashboard(companyId);
    case "PROJECT_MANAGER":
      return getManagerDashboard(userId, companyId);
    case "SITE_ENGINEER":
      return getEngineerDashboard(userId, companyId);
    case "SITE_SUPERVISOR":
      return getSupervisorDashboard(userId, companyId);
    default:
      throw Object.assign(new Error("Unknown role"), { statusCode: 403 });
  }
};

// ── COMPANY_ADMIN ─────────────────────────────────────────────────────────────
async function getAdminDashboard(companyId) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    projectStats,
    taskStats,
    issueStats,
    activeUserCount,
    recentReportCount,
    overdueTaskCount,
    allProjects,
  ] = await Promise.all([
    // 1. Projects grouped by status
    prisma.project.groupBy({
      by: ["status"],
      where: { companyId },
      _count: { id: true },
    }),

    // 2. Tasks grouped by taskStatus — no companyId on Task, go via project
    prisma.task.groupBy({
      by: ["taskStatus"],
      where: { project: { companyId } },
      _count: { id: true },
    }),

    // 3. Issues grouped by status
    prisma.issue.groupBy({
      by: ["status"],
      where: { companyId },
      _count: { id: true },
    }),

    // 4. Active users — UserStatus enum not a boolean
    prisma.user.count({
      where: { companyId, status: "ACTIVE" },
    }),

    // 5. Reports submitted in last 7 days
    prisma.report.count({
      where: { companyId, submittedAt: { gte: sevenDaysAgo } },
    }),

    // 6. Overdue tasks not yet done
    prisma.task.count({
      where: {
        project: { companyId },
        dueDate: { lt: now },
        taskStatus: { notIn: ["APPROVED"] },
      },
    }),

    // 7. All projects with budget for progress + cost calculation
    prisma.project.findMany({
      where: { companyId },
      select: {
        id: true,
        projectName: true,
        status: true,
        projectBudget: true,
        endDate: true,
      },
    }),
  ]);

  const projectIds = allProjects.map((p) => p.id);

  // Run progress and cost in parallel after we have the IDs
  const [progressMap, costMap] = await Promise.all([
    getProjectsWithProgress(projectIds),
    getProjectsCostSummary(projectIds),
  ]);

  // Merge progress + cost into each project
  const projectsWithStats = allProjects.map((p) => ({
    ...p,
    projectBudget: Number(p.projectBudget),
    progress: progressMap[p.id] ?? {
      totalTasks: 0,
      doneTasks: 0,
      progressPercent: 0,
    },
    totalTaskBudget: costMap[p.id] ?? 0,
    // What % of the project budget has been allocated to tasks
    budgetUtilization:
      Number(p.projectBudget) > 0
        ? Math.round(((costMap[p.id] ?? 0) / Number(p.projectBudget)) * 100)
        : 0,
  }));

  // Company-wide cost totals
  const totalProjectBudget = allProjects.reduce(
    (sum, p) => sum + Number(p.projectBudget),
    0,
  );
  const totalTaskBudget = Object.values(costMap).reduce((sum, v) => sum + v, 0);

  return {
    role: "COMPANY_ADMIN",
    // Status breakdown counts
    projects: groupByToMap(projectStats, "status"),
    tasks: groupByToMap(taskStats, "taskStatus"),
    issues: groupByToMap(issueStats, "status"),
    // Summary counts
    activeUserCount,
    recentReportCount,
    overdueTaskCount,
    // Per-project detail with progress % and cost
    projectsWithStats,
    // Company-wide cost totals
    companyTotals: {
      totalProjectBudget,
      totalTaskBudget,
      budgetVariance: totalProjectBudget - totalTaskBudget,
    },
  };
}

// ── PROJECT_MANAGER ───────────────────────────────────────────────────────────
async function getManagerDashboard(userId, companyId) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);

  const [myProjects, taskStats, openIssueCount, recentReportCount] =
    await Promise.all([
      // 1. Projects this manager owns
      prisma.project.findMany({
        where: { ownerUserId: userId, companyId },
        select: {
          id: true,
          projectName: true,
          status: true,
          endDate: true,
          projectBudget: true,
        },
      }),

      // 2. Task breakdown across their projects
      prisma.task.groupBy({
        by: ["taskStatus"],
        where: { project: { ownerUserId: userId, companyId } },
        _count: { id: true },
      }),

      // 3. Open issues on their projects
      prisma.issue.count({
        where: {
          companyId,
          status: { in: ["OPEN", "IN_PROGRESS"] },
          project: { ownerUserId: userId },
        },
      }),

      // 4. Reports submitted in last 7 days on their projects
      prisma.report.count({
        where: {
          companyId,
          project: { ownerUserId: userId },
          submittedAt: { gte: sevenDaysAgo },
        },
      }),
    ]);

  const projectIds = myProjects.map((p) => p.id);

  // Run progress and cost in parallel after we have the IDs
  const [progressMap, costMap] = await Promise.all([
    getProjectsWithProgress(projectIds),
    getProjectsCostSummary(projectIds),
  ]);

  // Merge progress + cost into each project
  const projectsWithStats = myProjects.map((p) => ({
    ...p,
    projectBudget: Number(p.projectBudget),
    progress: progressMap[p.id] ?? {
      totalTasks: 0,
      doneTasks: 0,
      progressPercent: 0,
    },
    totalTaskBudget: costMap[p.id] ?? 0,
    budgetUtilization:
      Number(p.projectBudget) > 0
        ? Math.round(((costMap[p.id] ?? 0) / Number(p.projectBudget)) * 100)
        : 0,
  }));

  // Manager-wide cost totals across all their projects
  const totalProjectBudget = myProjects.reduce(
    (sum, p) => sum + Number(p.projectBudget),
    0,
  );
  const totalTaskBudget = Object.values(costMap).reduce((sum, v) => sum + v, 0);

  return {
    role: "PROJECT_MANAGER",
    // Task status breakdown
    tasks: groupByToMap(taskStats, "taskStatus"),
    // Summary counts
    openIssueCount,
    recentReportCount,
    // Per-project detail with progress % and cost
    projectsWithStats,
    // Totals across all managed projects
    managerTotals: {
      totalProjectBudget,
      totalTaskBudget,
      budgetVariance: totalProjectBudget - totalTaskBudget,
    },
  };
}

// ── SITE_ENGINEER ─────────────────────────────────────────────────────────────
async function getEngineerDashboard(userId, companyId) {
  const now = new Date();

  const [myTaskStats, overdueTaskCount, assignedIssueCount, myReportCount] =
    await Promise.all([
      // 1. My tasks grouped by taskStatus — assigneeUserId field
      prisma.task.groupBy({
        by: ["taskStatus"],
        where: { assigneeUserId: userId, project: { companyId } },
        _count: { id: true },
      }),

      // 2. My overdue tasks not yet done
      prisma.task.count({
        where: {
          assigneeUserId: userId,
          project: { companyId },
          dueDate: { lt: now },
          taskStatus: { notIn: ["APPROVED"] },
        },
      }),

      // 3. Issues assigned to me still open
      prisma.issue.count({
        where: {
          assigneeId: userId,
          companyId,
          status: { in: ["OPEN", "IN_PROGRESS"] },
        },
      }),

      // 4. Reports I have submitted
      prisma.report.count({
        where: { userId, companyId },
      }),
    ]);

  return {
    role: "SITE_ENGINEER",
    tasks: groupByToMap(myTaskStats, "taskStatus"),
    overdueTaskCount,
    assignedIssueCount,
    myReportCount,
  };
}

// ── SITE_SUPERVISOR ───────────────────────────────────────────────────────────
async function getSupervisorDashboard(userId, companyId) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);

  const [myTaskStats, myReportCount, myOpenIssueCount, overdueTaskCount] =
    await Promise.all([
      // 1. My tasks grouped by taskStatus
      prisma.task.groupBy({
        by: ["taskStatus"],
        where: { assigneeUserId: userId, project: { companyId } },
        _count: { id: true },
      }),

      // 2. Reports I submitted this week — userId not submittedById
      prisma.report.count({
        where: {
          userId,
          companyId,
          submittedAt: { gte: sevenDaysAgo },
        },
      }),

      // 3. Issues I reported still open — reporterId
      prisma.issue.count({
        where: {
          reporterId: userId,
          companyId,
          status: { notIn: ["CLOSED"] },
        },
      }),

      // 4. My overdue tasks
      prisma.task.count({
        where: {
          assigneeUserId: userId,
          project: { companyId },
          dueDate: { lt: now },
          taskStatus: { notIn: ["APPROVED"] },
        },
      }),
    ]);

  return {
    role: "SITE_SUPERVISOR",
    tasks: groupByToMap(myTaskStats, "taskStatus"),
    myReportCount,
    myOpenIssueCount,
    overdueTaskCount,
  };
}

export default { getDashboardSummary };
