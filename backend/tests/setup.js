// tests/setup.js
import supertest from "supertest";
import app from "../src/server.js";
import prisma from "../src/config/prisma.js";

export { prisma };
export const request = supertest(app);

export const USERS = {
  admin: { email: "admin@conwise.test", password: "Admin@1234" },
  pm: { email: "pm@conwise.test", password: "Test@1234" },
  engineer: { email: "engineer@conwise.test", password: "Test@1234" },
  supervisor: { email: "supervisor@conwise.test", password: "Test@1234" },
};

/**
 * Login and return { token, userId, companyId }.
 * auth.service.loginUser() returns { accessToken, refreshToken, user, ... }
 */
export async function getAuth(role) {
  const { email, password } = USERS[role];
  const res = await request.post("/api/auth/login").send({ email, password });

  if (res.statusCode !== 200) {
    throw new Error(
      `getAuth('${role}') failed — HTTP ${res.statusCode}:\n` +
        JSON.stringify(res.body, null, 2) +
        "\n\n→ Run:  node tests/seed.js  then retry.",
    );
  }
  return {
    token: res.body.data.accessToken,
    userId: res.body.data.user.id,
    companyId: res.body.data.user.companyId,
  };
}
