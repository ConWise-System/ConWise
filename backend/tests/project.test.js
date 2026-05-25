// tests/project.test.js  ── TC-08 to TC-11
//
// Routes (server.js: app.use("/api/projects", projectRoutes)):
//   POST   /api/projects           createProject  — PM + COMPANY_ADMIN only
//   GET    /api/projects           getAllProjects
//   GET    /api/projects/:id       getProjectById
//   DELETE /api/projects/:id       deleteProject
//
// createProjectSchema fields: projectName, location, startDate, endDate?,
//   clientName, projectBudget, status?
// authorizeRoles enforces: COMPANY_ADMIN | PROJECT_MANAGER can create
// SITE_ENGINEER & SITE_SUPERVISOR → 403

import { request, prisma, getAuth } from "./setup.js";

let pm, engineer;
let createdProjectId;

// startDate must be today or future (createProjectSchema validation)
const today = new Date();
today.setUTCHours(0, 0, 0, 0);
const START = today.toISOString().split("T")[0];
const END = new Date(today.getTime() + 180 * 86400000)
  .toISOString()
  .split("T")[0]; // +6 months

const VALID_PROJECT = {
  projectName: "TC-08 Foundation Project",
  location: "Adama, Ethiopia",
  startDate: START,
  endDate: END,
  clientName: "Test Client Co.",
  projectBudget: 500000,
};

beforeAll(async () => {
  pm = await getAuth("pm");
  engineer = await getAuth("engineer");
});

afterAll(async () => {
  if (createdProjectId) {
    await prisma.task.deleteMany({ where: { projectId: createdProjectId } });
    await prisma.project.deleteMany({ where: { id: createdProjectId } });
  }
  await prisma.project.deleteMany({
    where: { projectName: VALID_PROJECT.projectName },
  });
  await prisma.$disconnect();
});

// ── TC-08 ─────────────────────────────────────────────────────────────────────
describe("TC-08 | PM creates project with all required fields → 201", () => {
  it("returns 201, project persisted in DB", async () => {
    const res = await request
      .post("/api/projects")
      .set("Authorization", `Bearer ${pm.token}`)
      .send(VALID_PROJECT);

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.projectName).toBe(VALID_PROJECT.projectName);
    // projectBudget serialized as string by serializeProject()
    expect(Number(res.body.data.projectBudget)).toBe(500000);
    createdProjectId = res.body.data.id;

    const db = await prisma.project.findUnique({
      where: { id: createdProjectId },
    });
    expect(db).not.toBeNull();
    // createProject() auto-initialises ProjectProgress at 0
    const progress = await prisma.projectProgress.findUnique({
      where: { projectId: createdProjectId },
    });
    expect(progress).not.toBeNull();
    expect(Number(progress.completionPercentage)).toBe(0);
  });

  it("new project appears in GET /api/projects", async () => {
    const res = await request
      .get("/api/projects")
      .set("Authorization", `Bearer ${pm.token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.map((p) => p.id)).toContain(createdProjectId);
  });
});

// ── TC-09 ─────────────────────────────────────────────────────────────────────
describe("TC-09 | Create project with endDate before startDate → 400", () => {
  it("returns 400 with endDate validation error", async () => {
    const res = await request
      .post("/api/projects")
      .set("Authorization", `Bearer ${pm.token}`)
      .send({
        ...VALID_PROJECT,
        projectName: "Bad Dates Project",
        startDate: END, // swap: start is 6 months away
        endDate: START, // end is today  → end < start → invalid
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    // createProjectSchema refine path: ["endDate"]
    expect(
      res.body.errors.some(
        (e) =>
          e.field === "endDate" ||
          e.message?.toLowerCase().includes("end date"),
      ),
    ).toBe(true);
  });
});

// ── TC-10 ─────────────────────────────────────────────────────────────────────
describe("TC-10 | SITE_ENGINEER cannot create a project → 403", () => {
  it("returns 403 — authorizeRoles blocks SITE_ENGINEER", async () => {
    const res = await request
      .post("/api/projects")
      .set("Authorization", `Bearer ${engineer.token}`)
      .send(VALID_PROJECT);

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });
});

// ── TC-11 ─────────────────────────────────────────────────────────────────────
describe("TC-11 | GET single project by ID", () => {
  it("returns 200 with full project details for owner", async () => {
    expect(createdProjectId).toBeDefined();

    const res = await request
      .get(`/api/projects/${createdProjectId}`)
      .set("Authorization", `Bearer ${pm.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe(createdProjectId);
    expect(res.body.data).toHaveProperty("projectProgress");
    expect(res.body.data).toHaveProperty("owner");
  });

  it("SITE_ENGINEER without task on project gets 404 (no task → filtered out)", async () => {
    // getProjectById for SITE_ENGINEER filters: tasks: { some: { assigneeUserId } }
    // Engineer has no tasks on this project yet → findFirst returns null → 404
    const res = await request
      .get(`/api/projects/${createdProjectId}`)
      .set("Authorization", `Bearer ${engineer.token}`);

    // 404 expected because engineer is not assigned to any task in this project
    expect([404]).toContain(res.statusCode);
  });
});
