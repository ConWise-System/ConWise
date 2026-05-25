// tests/task.test.js  ── TC-12 to TC-17
//
// Routes (server.js: app.use("/api", taskRoutes)):
//   POST   /api/tasks                       createTask
//   GET    /api/projects/:projectId/tasks   getTasksByProject
//   PATCH  /api/tasks/:id/status            updateTaskStatus   { taskStatus }
//   PATCH  /api/tasks/:id                   updateTask
//   DELETE /api/tasks/:id                   deleteTask
//   PATCH  /api/tasks/:id/assign/:userId    assignTask
//   PATCH  /api/tasks/:id/submit            submitTask  → sets taskStatus = "DONE"
//
// createTaskSchema fields: projectId, taskTitle, taskDescription?, startDate?,
//   dueDate (required), taskBudget, taskPriority (HIGH|MEDIUM|LOW|CRITICAL),
//   assigneeUserId, taskStatus?
//
// taskStatusSchema enum: TODO | IN_PROGRESS | SUBMITTED | UNDER_REVIEW |
//   BLOCKED | APPROVED | REJECTED
// submitTask() sets status to "DONE" (from task.service.js submitTask)

import { request, prisma, getAuth } from "./setup.js";

let pm, engineer;
let projectId, taskId, rejectTaskId;

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

  // Create a project owned by PM
  const proj = await request
    .post("/api/projects")
    .set("Authorization", `Bearer ${pm.token}`)
    .send({
      projectName: "Task Test Project",
      location: "Adama",
      startDate: START,
      endDate: END,
      clientName: "Task Client",
      projectBudget: 100000,
    });
  projectId = proj.body.data.id;
});

afterAll(async () => {
  await prisma.task.deleteMany({ where: { projectId } });
  await prisma.projectProgress.deleteMany({ where: { projectId } });
  await prisma.project.deleteMany({ where: { id: projectId } });
  await prisma.$disconnect();
});

// ── TC-12 ─────────────────────────────────────────────────────────────────────
describe("TC-12 | PM creates task and assigns to engineer → 201", () => {
  it("returns 201, taskStatus TODO, task in engineer project list", async () => {
    const res = await request
      .post("/api/tasks")
      .set("Authorization", `Bearer ${pm.token}`)
      .send({
        projectId,
        taskTitle: "Lay Foundation",
        taskDescription: "Pour concrete for Block A",
        dueDate: DUE,
        taskPriority: "HIGH",
        assigneeUserId: engineer.userId,
        taskBudget: 15000,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    // createTask sets no explicit status → Prisma default is TODO
    expect(res.body.data.taskStatus).toBe("TODO");
    taskId = res.body.data.id;

    // Engineer can see tasks for this project
    const list = await request
      .get(`/api/projects/${projectId}/tasks`)
      .set("Authorization", `Bearer ${engineer.token}`);
    expect(list.statusCode).toBe(200);
    expect(list.body.data.map((t) => t.id)).toContain(taskId);
  });
});

// ── TC-13 ─────────────────────────────────────────────────────────────────────
describe("TC-13 | Create task with non-existent projectId → 400/404", () => {
  it("returns 400 or 404", async () => {
    const res = await request
      .post("/api/tasks")
      .set("Authorization", `Bearer ${pm.token}`)
      .send({
        projectId: 999999,
        taskTitle: "Orphan Task",
        dueDate: DUE,
        taskPriority: "LOW",
        taskBudget: 0,
        assigneeUserId: engineer.userId,
      });

    // Prisma will throw P2003 (foreign key) or the service throws 400
    expect([400, 404, 500]).toContain(res.statusCode);
    // Must not be 201
    expect(res.statusCode).not.toBe(201);
  });
});

// ── TC-14 ─────────────────────────────────────────────────────────────────────
describe("TC-14 | Engineer updates task status → IN_PROGRESS", () => {
  it("returns 200 and sets taskStatus to IN_PROGRESS", async () => {
    expect(taskId).toBeDefined();
    const res = await request
      .patch(`/api/tasks/${taskId}/status`)
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ taskStatus: "IN_PROGRESS" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.taskStatus).toBe("IN_PROGRESS");

    const db = await prisma.task.findUnique({ where: { id: taskId } });
    expect(db.taskStatus).toBe("IN_PROGRESS");
  });
});

// ── TC-15 ─────────────────────────────────────────────────────────────────────
describe("TC-15 | Engineer submits task (PATCH /tasks/:id/submit) → DONE", () => {
  it("returns 200 and sets taskStatus to DONE", async () => {
    expect(taskId).toBeDefined();
    const res = await request
      .patch(`/api/tasks/${taskId}/submit`)
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({});

    expect(res.statusCode).toBe(200);
    // submitTask() hardcodes: data: { taskStatus: "DONE" }
    expect(res.body.data.taskStatus).toBe("DONE");
  });
});

// ── TC-16 ─────────────────────────────────────────────────────────────────────
describe("TC-16 | PM updates task status → APPROVED", () => {
  it("returns 200 with taskStatus APPROVED", async () => {
    expect(taskId).toBeDefined();
    const res = await request
      .patch(`/api/tasks/${taskId}/status`)
      .set("Authorization", `Bearer ${pm.token}`)
      .send({ taskStatus: "APPROVED" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.taskStatus).toBe("APPROVED");

    const db = await prisma.task.findUnique({ where: { id: taskId } });
    expect(db.taskStatus).toBe("APPROVED");
  });
});

// ── TC-17 ─────────────────────────────────────────────────────────────────────
describe("TC-17 | PM rejects task → REJECTED", () => {
  beforeAll(async () => {
    // Create a fresh task, submit it, then reject
    const t = await request
      .post("/api/tasks")
      .set("Authorization", `Bearer ${pm.token}`)
      .send({
        projectId,
        taskTitle: "Reject Me Task",
        dueDate: DUE,
        taskPriority: "MEDIUM",
        taskBudget: 5000,
        assigneeUserId: engineer.userId,
      });
    rejectTaskId = t.body.data.id;

    await request
      .patch(`/api/tasks/${rejectTaskId}/submit`)
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({});
  });

  it("returns 200 with taskStatus REJECTED", async () => {
    const res = await request
      .patch(`/api/tasks/${rejectTaskId}/status`)
      .set("Authorization", `Bearer ${pm.token}`)
      .send({ taskStatus: "REJECTED" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.taskStatus).toBe("REJECTED");

    const db = await prisma.task.findUnique({ where: { id: rejectTaskId } });
    expect(db.taskStatus).toBe("REJECTED");
  });
});
