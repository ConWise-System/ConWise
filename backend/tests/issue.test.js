// tests/issue.test.js  ── TC-22 to TC-25
//
// Routes (server.js: app.use("/api/projects/:projectId/issues", issueRoutes)):
//   POST   /api/projects/:projectId/issues                     createIssue
//   GET    /api/projects/:projectId/issues                     listIssues
//   GET    /api/projects/:projectId/issues/:issueId            getIssue
//   PATCH  /api/projects/:projectId/issues/:issueId            updateIssue
//   DELETE /api/projects/:projectId/issues/:issueId            deleteIssue
//   PATCH  /api/projects/:projectId/issues/:issueId/assign     assignIssue
//   PATCH  /api/projects/:projectId/issues/:issueId/status     updateStatus
//   GET    /api/projects/:projectId/issues/:issueId/audit      getAuditTrail
//
// createIssueSchema: title (min 3), description (min 10), priority (enum),
//   location?, photoUrls?, blockedTaskId?
//
// Issue state machine: OPEN → IN_PROGRESS → RESOLVED → CLOSED
//   (RESOLVED can go back to IN_PROGRESS)
// assignIssueSchema: { assigneeId (int positive), note? }
// updateStatusSchema: { status (enum), note? }
//
// CAN_CREATE: all four roles
// CAN_ASSIGN: COMPANY_ADMIN | PROJECT_MANAGER | SITE_ENGINEER
// CAN_CLOSE:  COMPANY_ADMIN | PROJECT_MANAGER

import { request, prisma, getAuth } from "./setup.js";

let admin, pm, engineer, supervisor;
let projectId, issueId;

const today = new Date();
today.setUTCHours(0, 0, 0, 0);
const START = today.toISOString().split("T")[0];
const END = new Date(today.getTime() + 180 * 86400000)
  .toISOString()
  .split("T")[0];

beforeAll(async () => {
  admin = await getAuth("admin");
  pm = await getAuth("pm");
  engineer = await getAuth("engineer");
  supervisor = await getAuth("supervisor");

  const proj = await request
    .post("/api/projects")
    .set("Authorization", `Bearer ${pm.token}`)
    .send({
      projectName: "Issue Test Project",
      location: "Adama",
      startDate: START,
      endDate: END,
      clientName: "Issue Client",
      projectBudget: 50000,
    });
  projectId = proj.body.data.id;
});

afterAll(async () => {
  await prisma.issueAuditLog.deleteMany({ where: { issue: { projectId } } });
  await prisma.issue.deleteMany({ where: { projectId } });
  await prisma.projectProgress.deleteMany({ where: { projectId } });
  await prisma.project.deleteMany({ where: { id: projectId } });
  await prisma.$disconnect();
});

// ── TC-22 ─────────────────────────────────────────────────────────────────────
describe("TC-22 | Supervisor logs new site issue → 201, status OPEN", () => {
  it("returns 201 with status OPEN and audit log entry", async () => {
    const res = await request
      .post(`/api/projects/${projectId}/issues`)
      .set("Authorization", `Bearer ${supervisor.token}`)
      .send({
        title: "Concrete mix ratio incorrect",
        description:
          "Block B concrete mix does not match spec — requires inspection",
        priority: "HIGH",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.status).toBe("OPEN");
    expect(res.body.data.priority).toBe("HIGH");
    issueId = res.body.data.id;

    // Verify in DB
    const db = await prisma.issue.findUnique({ where: { id: issueId } });
    expect(db).not.toBeNull();
    expect(db.status).toBe("OPEN");

    // createIssue() writes an audit log on creation
    const logs = await prisma.issueAuditLog.findMany({ where: { issueId } });
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].action).toBe("CREATED");
  });

  it("issue appears in GET list for this project", async () => {
    const res = await request
      .get(`/api/projects/${projectId}/issues`)
      .set("Authorization", `Bearer ${pm.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.map((i) => i.id)).toContain(issueId);
  });
});

// ── TC-23 ─────────────────────────────────────────────────────────────────────
describe("TC-23 | Engineer updates issue status → IN_PROGRESS", () => {
  it("returns 200 after PM assigns, then engineer moves to IN_PROGRESS", async () => {
    expect(issueId).toBeDefined();

    // PM assigns issue to engineer first (CAN_ASSIGN includes PROJECT_MANAGER)
    const assign = await request
      .patch(`/api/projects/${projectId}/issues/${issueId}/assign`)
      .set("Authorization", `Bearer ${pm.token}`)
      .send({ assigneeId: engineer.userId });
    expect(assign.statusCode).toBe(200);

    // State machine: OPEN → IN_PROGRESS  (valid transition)
    const res = await request
      .patch(`/api/projects/${projectId}/issues/${issueId}/status`)
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ status: "IN_PROGRESS" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe("IN_PROGRESS");

    const db = await prisma.issue.findUnique({ where: { id: issueId } });
    expect(db.status).toBe("IN_PROGRESS");
  });
});

// ── TC-24 ─────────────────────────────────────────────────────────────────────
describe("TC-24 | PM closes resolved issue → CLOSED", () => {
  it("full state machine path: IN_PROGRESS → RESOLVED → CLOSED", async () => {
    expect(issueId).toBeDefined();

    // IN_PROGRESS → RESOLVED
    const resolve = await request
      .patch(`/api/projects/${projectId}/issues/${issueId}/status`)
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({
        status: "RESOLVED",
        note: "Mix ratio corrected and re-inspected",
      });
    expect(resolve.statusCode).toBe(200);
    expect(resolve.body.data.status).toBe("RESOLVED");
    expect(resolve.body.data.resolvedAt).not.toBeNull();

    // RESOLVED → CLOSED  (CAN_CLOSE: PM + ADMIN only)
    const close = await request
      .patch(`/api/projects/${projectId}/issues/${issueId}/status`)
      .set("Authorization", `Bearer ${pm.token}`)
      .send({ status: "CLOSED", note: "Verified on site — closing" });
    expect(close.statusCode).toBe(200);
    expect(close.body.data.status).toBe("CLOSED");

    const db = await prisma.issue.findUnique({ where: { id: issueId } });
    expect(db.status).toBe("CLOSED");
    expect(db.closedAt).not.toBeNull();
  });

  it("SITE_SUPERVISOR cannot close an issue → 403", async () => {
    // Create a fresh issue to attempt closing
    const fresh = await request
      .post(`/api/projects/${projectId}/issues`)
      .set("Authorization", `Bearer ${supervisor.token}`)
      .send({
        title: "Supervisor Close Attempt",
        description: "Testing that supervisor cannot close issues directly",
        priority: "LOW",
      });
    const freshId = fresh.body.data.id;

    // Move to IN_PROGRESS first
    await request
      .patch(`/api/projects/${projectId}/issues/${freshId}/assign`)
      .set("Authorization", `Bearer ${pm.token}`)
      .send({ assigneeId: engineer.userId });

    await request
      .patch(`/api/projects/${projectId}/issues/${freshId}/status`)
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ status: "IN_PROGRESS" });

    await request
      .patch(`/api/projects/${projectId}/issues/${freshId}/status`)
      .set("Authorization", `Bearer ${engineer.token}`)
      .send({ status: "RESOLVED" });

    // Now supervisor tries to CLOSE — should fail
    const res = await request
      .patch(`/api/projects/${projectId}/issues/${freshId}/status`)
      .set("Authorization", `Bearer ${supervisor.token}`)
      .send({ status: "CLOSED" });

    expect(res.statusCode).toBe(403);
  });
});

// ── TC-25 ─────────────────────────────────────────────────────────────────────
describe("TC-25 | Create issue with invalid description → 400", () => {
  it("returns 400 when description is blank", async () => {
    const res = await request
      .post(`/api/projects/${projectId}/issues`)
      .set("Authorization", `Bearer ${supervisor.token}`)
      .send({
        title: "Empty Description Issue",
        description: "", // fails min(10) in createIssueSchema
        priority: "LOW",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("returns 400 when description is too short (under 10 chars)", async () => {
    const res = await request
      .post(`/api/projects/${projectId}/issues`)
      .set("Authorization", `Bearer ${supervisor.token}`)
      .send({
        title: "Short Desc",
        description: "Too short", // 9 chars — fails min(10)
        priority: "MEDIUM",
      });

    expect(res.statusCode).toBe(400);
  });

  it("returns 400 for invalid status transition (OPEN → CLOSED skipping steps)", async () => {
    // Create fresh OPEN issue
    const fresh = await request
      .post(`/api/projects/${projectId}/issues`)
      .set("Authorization", `Bearer ${supervisor.token}`)
      .send({
        title: "Skip State Machine",
        description: "Attempting to skip straight to CLOSED from OPEN",
        priority: "LOW",
      });
    const freshId = fresh.body.data.id;

    // OPEN → CLOSED is NOT a valid transition (VALID_TRANSITIONS.OPEN = ["IN_PROGRESS"])
    const res = await request
      .patch(`/api/projects/${projectId}/issues/${freshId}/status`)
      .set("Authorization", `Bearer ${pm.token}`)
      .send({ status: "CLOSED" });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/invalid status transition/i);
  });
});
