// tests/seed.js
// Run ONCE before `npm test`.  Usage:  node tests/seed.js
// Safe to re-run — skips users that already exist.

import prisma from "../src/config/prisma.js";
import { hashPassword } from "../src/utils/auth/hash.js";

const SEED_USERS = [
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@conwise.test",
    password: "Admin@1234",
    role: "COMPANY_ADMIN",
  },
  {
    firstName: "Project",
    lastName: "Manager",
    email: "pm@conwise.test",
    password: "Test@1234",
    role: "PROJECT_MANAGER",
  },
  {
    firstName: "Site",
    lastName: "Engineer",
    email: "engineer@conwise.test",
    password: "Test@1234",
    role: "SITE_ENGINEER",
  },
  {
    firstName: "Site",
    lastName: "Supervisor",
    email: "supervisor@conwise.test",
    password: "Test@1234",
    role: "SITE_SUPERVISOR",
  },
];

async function seed() {
  console.log("Seeding test users…\n");

  // Every user needs a companyId (schema.prisma User.companyId Int?)
  let company = await prisma.company.findFirst({
    where: { name: "ConWise Test Co." },
  });
  if (!company) {
    company = await prisma.company.create({
      data: {
        name: "ConWise Test Co.",
        email: "testco@conwise.test",
        status: "ACTIVE",
      },
    });
    console.log(`  ✓ Created company id=${company.id}`);
  } else {
    console.log(`  → Using company id=${company.id}`);
  }

  for (const u of SEED_USERS) {
    const exists = await prisma.user.findUnique({ where: { email: u.email } });
    if (exists) {
      console.log(`  → Skipped: ${u.email}`);
      continue;
    }

    // hashPassword returns { value: bcryptHash }  (auth.service.js line: const { value: passwordHash } = await hashPassword(password))
    const { value: passwordHash } = await hashPassword(u.password);

    await prisma.user.create({
      data: {
        companyId: company.id,
        role: u.role,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        passwordHash,
        isVerified: true, // bypass email verification for test accounts
        status: "ACTIVE",
      },
    });
    console.log(`  ✓ ${u.email}  [${u.role}]`);
  }

  console.log("\nDone. Run:  npm test");
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error("Seed failed:", e.message);
  process.exit(1);
});
