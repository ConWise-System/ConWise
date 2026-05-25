// tests/report.test.js  ── TC-18 to TC-21
//
// Routes (server.js: app.use("/api/reports", reportRoutes)):
//   POST  /api/reports            createReport
//   GET   /api/reports            getProjectReports  (query: projectId)
//   GET   /api/reports/all        getAllReports
//   DELETE /api/reports/:reportId deleteReport
//
// createReportSchema fields:
//   projectId (int), reportTitle (min 5), reportType (enum),
//   reportDate (datetime ISO string), workCompleted (min 10),
//   workersPresent (int nonneg), materialsUsed?, weatherCondition?,
//   challenges?, progressPhotoUrl?
//
// authorizeRoles: report submission allowed for SITE_SUPERVISOR + SITE_ENGINEER
//   (check your report.routes.js — adjust if SITE_ENGINEER is blocked)

import { request, prisma, getAuth } from "./setup.js";

let pm, engineer, supervisor;
let projectId, reportId;

const today = new Date();
today.setUTCHours(0, 0, 0, 0);
const START = today.toISOString().split("T")[0];
const END = new Date(today.getTime() + 180 * 86400000)
  .toISOString()
  .split("T")[0];
const REPORT_DATE = new Date().toISOString(); // reportDate is z.string().datetime()

beforeAll(async () => {
  pm = await getAuth("pm");
  engineer = await getAuth("engineer");
  supervisor = await getAuth("supervisor");

  const proj = await request
    .post("/api/projects")
    .set("Authorization", `Bearer ${pm.token}`)
    .send({
      projectName: "Report Test Project",
      location: "Adama",
      startDate: START,
      endDate: END,
      clientName: "Report Client",
      projectBudget: 200000,
    });
  projectId = proj.body.data.id;
});

afterAll(async () => {
  await prisma.report.deleteMany({ where: { projectId } });
  await prisma.projectProgress.deleteMany({ where: { projectId } });
  await prisma.project.deleteMany({ where: { id: projectId } });
  await prisma.$disconnect();
});

// ── TC-18 ─────────────────────────────────────────────────────────────────────
describe("TC-18 | Supervisor submits a complete daily site report → 201", () => {
  it("returns 201 and persists report in DB", async () => {
    const res = await request
      .post("/api/reports")
      .set("Authorization", `Bearer ${supervisor.token}`)
      .send({
        projectId,
        reportTitle: "Day 1 Site Report",
        reportType: "DAILY_SITE_REPORT",
        reportDate: REPORT_DATE,
        workCompleted: "Excavation completed on Block A — 40 linear metres",
        workersPresent: 15,
        materialsUsed: "Gravel 5m3, Sand 3m3",
        weatherCondition: "Sunny, 28°C",
        challenges: "None reported",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    reportId = res.body.data.id;

    const db = await prisma.report.findUnique({ where: { id: reportId } });
    expect(db).not.toBeNull();
    expect(db.projectId).toBe(projectId);
  });

  it("report appears in GET /api/reports?projectId=", async () => {
    const res = await request
      .get(`/api/reports?projectId=${projectId}`)
      .set("Authorization", `Bearer ${pm.token}`);

    expect(res.statusCode).toBe(200);
    // Response may be array or { data: [...] }
    const list = Array.isArray(res.body)
      ? res.body
      : (res.body.data ?? res.body.reports ?? []);
    expect(list.map((r) => r.id)).toContain(reportId);
  });
});

// ── TC-19 ─────────────────────────────────────────────────────────────────────
describe("TC-19 | Submit report with blank workCompleted → 400", () => {
  it("returns 400 — workCompleted requires min 10 chars", async () => {
    const res = await request
      .post("/api/reports")
      .set("Authorization", `Bearer ${supervisor.token}`)
      .send({
        projectId,
        reportTitle: "Empty Work Report",
        reportType: "DAILY_SITE_REPORT",
        reportDate: REPORT_DATE,
        workCompleted: "", // fails z.string().min(10)
        workersPresent: 5,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 when workCompleted has fewer than 10 characters", async () => {
    const res = await request
      .post("/api/reports")
      .set("Authorization", `Bearer ${supervisor.token}`)
      .send({
        projectId,
        reportTitle: "Short Work",
        reportType: "DAILY_SITE_REPORT",
        reportDate: REPORT_DATE,
        workCompleted: "Short", // only 5 chars — fails min(10)
        workersPresent: 3,
      });

    expect(res.statusCode).toBe(400);
  });
});

// ── TC-20 ─────────────────────────────────────────────────────────────────────
describe("TC-20 | PM can read all reports for their project", () => {
  it("GET /api/reports?projectId returns the submitted report", async () => {
    expect(reportId).toBeDefined();

    const res = await request
      .get(`/api/reports?projectId=${projectId}`)
      .set("Authorization", `Bearer ${pm.token}`);

    expect(res.statusCode).toBe(200);
    const list = Array.isArray(res.body)
      ? res.body
      : (res.body.data ?? res.body.reports ?? []);
    const found = list.find((r) => r.id === reportId);
    expect(found).toBeDefined();
    expect(found.workCompleted).toBe(
      "Excavation completed on Block A — 40 linear metres",
    );
  });
});

// ── TC-21 ─────────────────────────────────────────────────────────────────────
describe("TC-21 | Unauthenticated user cannot access reports → 401", () => {
  it("GET /api/reports without token → 401", async () => {
    const res = await request.get("/api/reports");
    expect(res.statusCode).toBe(401);
  });

  it("POST /api/reports without token → 401", async () => {
    const res = await request.post("/api/reports").send({ projectId });
    expect(res.statusCode).toBe(401);
  });
});
