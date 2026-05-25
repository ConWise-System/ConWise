import prisma from "../src/config/prisma.js";

const company = await prisma.company.updateMany({
  where: { name: "ConWise Test Co." },
  data: { status: 'ACTIVE' }
});

console.log('Updated company status to ACTIVE');

const users = await prisma.user.updateMany({
  where: { 
    email: { in: ['admin@conwise.test', 'pm@conwise.test', 'engineer@conwise.test', 'supervisor@conwise.test'] }
  },
  data: { isVerified: true, status: 'ACTIVE' }
});

console.log('Updated:', users.count, 'users');

await prisma.$disconnect();