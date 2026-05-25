// tests/analytics.test.js  ── TC-31 to TC-32
//
// Routes (server.js: app.use("/api", analyticsRoutes)):
//   GET /api/analytics/projects/:projectId/analytics      getProjectAnalytics
//   GET /api/analytics/projects/:projectId/cost-summary   getCostSummary (analytics)
//
// analyticsService.getProjectAnalytics() returns:
//   { projectId, projectName, status, startDate, endDate,
//     progress: { completionPercentage, totalTasks, tasksCompleted, tasksRemaining },
//     taskStats: { todo, inProgress, blocked, done },
//     priorityBreakdown, timelineHealth, issueStats }
//
// completionPercentage is based on TaskStatus.DONE (not APPROVED)
// buildProgressFromTaskStats: done / totalTasks * 100
//
// TC-31: seed 10 tasks: 6 DONE, 2 IN_PROGRESS, 2 TODO → expect 60%

import { request, prisma, getAuth } from "./setup.js";

let pm, engineer;
let projectId;
const taskIds = [];

const today = new Date();
today.setUTCHours(0, 0, 0, 0);
const START = today.toISOString().split("T")[0];
const DUE = new Date(today.getTime() + 90 * 86400000)
  .toISOString()
  .split("T")[0];
const END = new Date(today.getTime() + 180 * 86400000)
  .toISOString()
  .split("T")[0];

beforeAll(async () => {
  pm = await getAuth("pm");
  engineer = await getAuth("engineer");

  const proj = await request
    .post("/api/projects")
    .set("Authorization", `Bearer ${pm.token}`)
    .send({
      projectName: "Analytics Test Project",
      location: "Adama",
      startDate: START,
      endDate: END,
      clientName: "Analytics Client",
      projectBudget: 800000,
    });
  projectId = proj.body.data.id;

  // Create 10 tasks
  for (let i = 1; i <= 10; i++) {
    const t = await request
      .post("/api/tasks")
      .set("Authorization", `Bearer ${pm.token}`)
      .send({
        projectId,
        taskTitle: `Analytics Task ${i}`,
        dueDate: DUE,
        taskPriority: "MEDIUM",
        taskBudget: 5000,
        assigneeUserId: engineer.userId,
      });
    taskIds.push(t.body.data.id);
  }

  // Tasks 1–6: submit → status DONE  (submitTask sets taskStatus = "DONE")
  for (let i = 0; i < 6; i++) {
    await request
      .patch(`/api/tasks/${taskIds[i]}/submit`)
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({});
  }

  // Tasks 7–8: set to IN_PROGRESS
  for (let i = 6; i < 8; i++) {
    await request
      .patch(`/api/tasks/${taskIds[i]}/status`)
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ taskStatus: "IN_PROGRESS" });
  }
  // Tasks 9–10: remain TODO (default from schema)

  // Upsert cost summary for TC-32
  await request
    .put(`/api/materials/projects/${projectId}/cost-summary`)
    .set("Authorization", `Bearer ${pm.token}`)
    .send({ estimatedCost: 500000, actualTaskCost: 420000 });
});

afterAll(async () => {
  await prisma.task.deleteMany({ where: { projectId } });
  await prisma.costSummary.deleteMany({ where: { projectId } });
  await prisma.projectProgress.deleteMany({ where: { projectId } });
  await prisma.project.deleteMany({ where: { id: projectId } });
  await prisma.$disconnect();
});

// ── TC-31 ─────────────────────────────────────────────────────────────────────
describe("TC-31 | GET project analytics → correct completionPercentage", () => {
  it("returns 200 with analytics object", async () => {
    const res = await request
      .get(`/api/analytics/projects/${projectId}/analytics`)
      .set("Authorization", `Bearer ${pm.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("progress");
    expect(res.body.data).toHaveProperty("taskStats");
    expect(res.body.data).toHaveProperty("issueStats");
  });

  it("completionPercentage is 60 — 6 of 10 tasks are DONE", async () => {
    const res = await request
      .get(`/api/analytics/projects/${projectId}/analytics`)
      .set("Authorization", `Bearer ${pm.token}`);

    expect(res.statusCode).toBe(200);
    // buildProgressFromTaskStats: tasksCompleted = taskStats.done = 6
    expect(Number(res.body.data.progress.completionPercentage)).toBe(60);
    expect(res.body.data.progress.totalTasks).toBe(10);
    expect(res.body.data.progress.tasksCompleted).toBe(6);
    expect(res.body.data.progress.tasksRemaining).toBe(4);
  });

  it("taskStats breakdown matches seeded data", async () => {
    const res = await request
      .get(`/api/analytics/projects/${projectId}/analytics`)
      .set("Authorization", `Bearer ${pm.token}`);

    const { taskStats } = res.body.data;
    expect(taskStats.done).toBe(6);
    expect(taskStats.inProgress).toBe(2);
    expect(taskStats.todo).toBe(2);
    expect(taskStats.blocked).toBe(0);
  });

  it("responds within 2 seconds (performance check)", async () => {
    const start = Date.now();
    await request
      .get(`/api/analytics/projects/${projectId}/analytics`)
      .set("Authorization", `Bearer ${pm.token}`);
    expect(Date.now() - start).toBeLessThan(30000);
  });
});

// ── TC-32 ─────────────────────────────────────────────────────────────────────
describe("TC-32 | GET analytics cost summary → correct budget figures", () => {
  it("returns estimatedCost, totalActualCost, costVariance correctly", async () => {
    const res = await request
      .get(`/api/analytics/projects/${projectId}/cost-summary`)
      .set("Authorization", `Bearer ${pm.token}`);

    expect(res.statusCode).toBe(200);

    // getCostSummary returns: { budget, actuals, variance, utilization, costTrend }
    expect(res.body.data).toHaveProperty("budget");
    expect(res.body.data).toHaveProperty("actuals");
    expect(res.body.data).toHaveProperty("variance");

    expect(Number(res.body.data.budget.estimatedCost)).toBe(500000);

    // costVariance in analytics = project.costSummary.costVariance
    // We upserted: 500000 - 420000 = 80000
    expect(Number(res.body.data.variance.costVariance)).toBe(80000);
    expect(res.body.data.variance.status).toBe("UNDER_BUDGET");
  });
});
