import prisma from "../src/config/prisma.js";

const pmUser = await prisma.user.findUnique({
  where: { email: 'pm@conwise.test' },
  include: { company: true }
});

console.log('PM User:', JSON.stringify(pmUser, null, 2));

const company = await prisma.company.findFirst({
  where: { name: "ConWise Test Co." }
});

console.log('ConWise Test Co. Company:', JSON.stringify(company, null, 2));

if (pmUser && company && pmUser.companyId !== company.id) {
  await prisma.user.update({
    where: { email: 'pm@conwise.test' },
    data: { companyId: company.id }
  });
  console.log('Updated pm user to use ConWise Test Co.');
}

await prisma.$disconnect();