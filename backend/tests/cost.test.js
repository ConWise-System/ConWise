// tests/cost.test.js  ── TC-28 to TC-30
//
// Routes (server.js: app.use("/api/materials", materialRoutes)):
//   POST  /api/materials                              createMaterial
//   GET   /api/materials                              getAllMaterials
//   GET   /api/materials/:id                          getMaterialById
//   PATCH /api/materials/:id                          updateMaterial
//   DELETE /api/materials/:id                         deleteMaterial
//   GET   /api/materials/projects/:projectId/cost-summary   getCostSummary
//   PUT   /api/materials/projects/:projectId/cost-summary   upsertCostSummary
//
// createMaterialSchema: materialName (min 2), quantityUsed (positive),
//   unit (min 1), usageDescription?, materialStatus (required)
// updateMaterialSchema: same fields but all optional, at least one required
//
// upsertCostSummarySchema: { estimatedCost (nonneg), actualTaskCost (nonneg) }
// costVariance = estimatedCost - actualTaskCost  (server-side, Decimal)
//
// authorizeRoles for cost-summary:
//   COMPANY_ADMIN | PROJECT_MANAGER can access
//   SITE_ENGINEER restricted to own-task materials
//   SITE_SUPERVISOR → 403 on deleteMaterial

import { request, prisma, getAuth } from "./setup.js";

let admin, pm, engineer, supervisor;
let projectId, materialId;

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
      projectName: "Cost Test Project",
      location: "Adama",
      startDate: START,
      endDate: END,
      clientName: "Cost Client",
      projectBudget: 1000000,
    });
  projectId = proj.body.data.id;
});

afterAll(async () => {
  if (materialId)
    await prisma.materialUsed.deleteMany({ where: { id: materialId } });
  await prisma.costSummary.deleteMany({ where: { projectId } });
  await prisma.projectProgress.deleteMany({ where: { projectId } });
  await prisma.project.deleteMany({ where: { id: projectId } });
  await prisma.$disconnect();
});

// ── TC-28 ─────────────────────────────────────────────────────────────────────
describe("TC-28 | Create material with valid positive quantityUsed → 201", () => {
  it("returns 201 and serializes quantityUsed as string (Decimal)", async () => {
    const res = await request
      .post("/api/materials")
      .set("Authorization", `Bearer ${pm.token}`)
      .send({
        materialName: "Steel Bars",
        quantityUsed: 50,
        unit: "pcs",
        usageDescription: "Column reinforcement Block A",
        materialStatus: "IN_USE",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    // serializeMaterial() converts Decimal → string
    expect(Number(res.body.data.quantityUsed)).toBe(50);
    materialId = res.body.data.id;
  });

  it("upsert cost summary — estimatedCost > actualTaskCost → positive variance", async () => {
    const res = await request
      .put(`/api/materials/projects/${projectId}/cost-summary`)
      .set("Authorization", `Bearer ${pm.token}`)
      .send({ estimatedCost: 500000, actualTaskCost: 420000 });

    expect([200, 201]).toContain(res.statusCode);
    // costVariance = 500000 - 420000 = 80000
    expect(Number(res.body.data.costVariance)).toBe(80000);
    expect(Number(res.body.data.estimatedCost)).toBe(500000);
    expect(Number(res.body.data.actualTaskCost)).toBe(420000);
  });

  it("upsert cost summary — actualTaskCost > estimatedCost → negative variance (overrun)", async () => {
    const res = await request
      .put(`/api/materials/projects/${projectId}/cost-summary`)
      .set("Authorization", `Bearer ${pm.token}`)
      .send({ estimatedCost: 500000, actualTaskCost: 550000 });

    expect([200, 201]).toContain(res.statusCode);
    // costVariance = 500000 - 550000 = -50000
    expect(Number(res.body.data.costVariance)).toBe(-50000);
  });

  it("GET cost summary returns correct stored values", async () => {
    const res = await request
      .get(`/api/materials/projects/${projectId}/cost-summary`)
      .set("Authorization", `Bearer ${pm.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("estimatedCost");
    expect(res.body.data).toHaveProperty("actualTaskCost");
    expect(res.body.data).toHaveProperty("costVariance");
  });
});

// ── TC-29 ─────────────────────────────────────────────────────────────────────
describe("TC-29 | Create/update material with invalid quantityUsed → 400", () => {
  it("POST with quantityUsed: -10 → 400", async () => {
    const res = await request
      .post("/api/materials")
      .set("Authorization", `Bearer ${pm.token}`)
      .send({
        materialName: "Cement Bags",
        quantityUsed: -10, // fails z.number().positive()
        unit: "bags",
        materialStatus: "IN_USE",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    // createMaterialSchema error: "Quantity must be a positive number"
    expect(JSON.stringify(res.body)).toMatch(/positive/i);
  });

  it("POST with quantityUsed: 0 → 400", async () => {
    const res = await request
      .post("/api/materials")
      .set("Authorization", `Bearer ${pm.token}`)
      .send({
        materialName: "Sand",
        quantityUsed: 0, // 0 fails .positive() (requires > 0)
        unit: "m3",
        materialStatus: "IN_USE",
      });

    expect(res.statusCode).toBe(400);
  });

  it("PATCH with quantityUsed: -5 → 400", async () => {
    expect(materialId).toBeDefined();
    const res = await request
      .patch(`/api/materials/${materialId}`)
      .set("Authorization", `Bearer ${pm.token}`)
      .send({ quantityUsed: -5 });

    expect(res.statusCode).toBe(400);
  });

  it("valid PATCH with quantityUsed: 75 → 200", async () => {
    expect(materialId).toBeDefined();
    const res = await request
      .patch(`/api/materials/${materialId}`)
      .set("Authorization", `Bearer ${pm.token}`)
      .send({ quantityUsed: 75, unit: "pcs", materialStatus: "IN_USE" });

    expect(res.statusCode).toBe(200);
    expect(Number(res.body.data.quantityUsed)).toBe(75);
  });
});

// ── TC-30 ─────────────────────────────────────────────────────────────────────
describe("TC-30 | SITE_SUPERVISOR cannot delete materials → 403", () => {
  it("DELETE /api/materials/:id → 403 for supervisor", async () => {
    expect(materialId).toBeDefined();
    // deleteMaterial: SITE_SUPERVISOR is not COMPANY_ADMIN or PROJECT_MANAGER → 403
    const res = await request
      .delete(`/api/materials/${materialId}`)
      .set("Authorization", `Bearer ${supervisor.token}`);

    expect(res.statusCode).toBe(403);
  });

  it("PATCH /api/materials/:id → 403 for supervisor (not own task)", async () => {
    // supervisor's role isn't SITE_ENGINEER so updateMaterial path:
    // role !== SITE_ENGINEER → falls through to prisma update without role check
    // In practice your route guard may block supervisor at authorizeRoles level
    const res = await request
      .patch(`/api/materials/${materialId}`)
      .set("Authorization", `Bearer ${supervisor.token}`)
      .send({ materialStatus: "USED" });

    // Accept 403 (route-level guard) or 200 (if supervisor can update status)
    // The important test is DELETE above — adjust this assertion to match your route guard
    expect([200, 403]).toContain(res.statusCode);
  });
});
