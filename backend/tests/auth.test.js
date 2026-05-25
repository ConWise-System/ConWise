// tests/auth.test.js  ── TC-01 to TC-07
//
// Route:   POST /api/auth/register-company  (registerCompanySchema)
// Route:   POST /api/auth/login             (loginSchema: { email, password })
// Returns: { accessToken, refreshToken, user, redirectTo, message }
// Auth MW: authenticate() → sets req.user, throws 401 if missing/bad token

import { request, prisma, USERS } from "./setup.js";

const TC01_EMAIL = "tc01.newadmin@conwise.test";
const TC01_COMPANY = "tc01company@conwise.test";

beforeAll(async () => {
  await prisma.user.deleteMany({
    where: { email: { in: [TC01_EMAIL, "tc03user@conwise.test"] } },
  });
  await prisma.company.deleteMany({ where: { email: TC01_COMPANY } });
});
afterAll(async () => {
  await prisma.user.deleteMany({
    where: { email: { in: [TC01_EMAIL, "tc03user@conwise.test"] } },
  });
  await prisma.company.deleteMany({ where: { email: TC01_COMPANY } });
  await prisma.$disconnect();
});

// ── TC-01 ─────────────────────────────────────────────────────────────────────
describe("TC-01 | Register company with valid data → 201", () => {
  it("creates user + company, returns user object", async () => {
    const res = await request.post("/api/auth/register-company").send({
      companyName: "TC01 Test Company",
      companyEmail: TC01_COMPANY,
      firstName: "TC01",
      lastName: "Admin",
      email: TC01_EMAIL,
      password: "Test@1234",
      confirmPassword: "Test@1234",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("user");
    expect(res.body.data).toHaveProperty("company");

    const db = await prisma.user.findUnique({ where: { email: TC01_EMAIL } });
    expect(db).not.toBeNull();
    expect(db.role).toBe("COMPANY_ADMIN");
  });
});

// ── TC-02 ─────────────────────────────────────────────────────────────────────
describe("TC-02 | Register with duplicate email → 409", () => {
  it("returns 409 with USER_ALREADY_EXISTS message", async () => {
    const res = await request.post("/api/auth/register-company").send({
      companyName: "Dup Co",
      companyEmail: "dupco@conwise.test",
      firstName: "Dup",
      lastName: "User",
      email: USERS.pm.email, // already seeded
      password: "Test@1234",
      confirmPassword: "Test@1234",
    });

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toMatch(/already exists/i);
  });
});

// ── TC-03 ─────────────────────────────────────────────────────────────────────
describe("TC-03 | Register with blank password → 400", () => {
  it("returns 400 with Zod errors array", async () => {
    const res = await request.post("/api/auth/register-company").send({
      companyName: "NoPwd Co",
      companyEmail: "nopwdco@conwise.test",
      firstName: "No",
      lastName: "Password",
      email: "tc03user@conwise.test",
      password: "", // fails min(8) in passwordSchema
      confirmPassword: "",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body).toHaveProperty("errors");
  });
});

// ── TC-04 ─────────────────────────────────────────────────────────────────────
describe("TC-04 | Login — all roles return accessToken", () => {
  test.each(["admin", "pm", "engineer", "supervisor"])(
    "%s → 200 + accessToken + user object",
    async (role) => {
      const { email, password } = USERS[role];
      const res = await request
        .post("/api/auth/login")
        .send({ email, password });

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty("accessToken");
      expect(res.body.data.accessToken.split(".").length).toBe(3);
      expect(res.body.data.user).toHaveProperty("id");
      expect(res.body.data.user).toHaveProperty("companyId");
      expect(res.body.data).toHaveProperty("redirectTo");
    },
  );
});

// ── TC-05 ─────────────────────────────────────────────────────────────────────
describe("TC-05 | Login with wrong password → 401", () => {
  it("returns 401 INVALID_CREDENTIALS, no accessToken", async () => {
    const res = await request
      .post("/api/auth/login")
      .send({ email: USERS.pm.email, password: "WrongPassword!" });

    expect(res.statusCode).toBe(401);
    expect(res.body).not.toHaveProperty("accessToken");
    // AUTH_MESSAGES.INVALID_CREDENTIALS = "Invalid email/phone or password."
    expect(res.body.message).toMatch(/invalid/i);
  });
});

// ── TC-06 ─────────────────────────────────────────────────────────────────────
describe("TC-06 | Protected routes reject missing token → 401", () => {
  test.each(["/api/projects", "/api/materials", "/api/auth/me"])(
    "GET %s without Authorization header → 401",
    async (path) => {
      const res = await request.get(path);
      expect(res.statusCode).toBe(401);
    },
  );
});

// ── TC-07 ─────────────────────────────────────────────────────────────────────
describe("TC-07 | Tampered token → 401", () => {
  it("rejects completely fake token string", async () => {
    const res = await request
      .get("/api/projects")
      .set("Authorization", "Bearer fake.token.value");
    expect(res.statusCode).toBe(401);
  });

  it("rejects valid JWT with replaced signature", async () => {
    const login = await request
      .post("/api/auth/login")
      .send({ email: USERS.pm.email, password: USERS.pm.password });
    const [h, p] = login.body.data.accessToken.split(".");

    const res = await request
      .get("/api/projects")
      .set("Authorization", `Bearer ${h}.${p}.badsignature`);
    expect(res.statusCode).toBe(401);
  });
});
