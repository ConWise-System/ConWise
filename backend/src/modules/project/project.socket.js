import prisma from "../../config/prisma.js";

export async function isProjectMember(projectId, userId) {
  if (!projectId || !userId) return false;
  const project = await prisma.project.findFirst({
    where: {
      id: Number(projectId),
      OR: [
        { ownerUserId: Number(userId) },
        { tasks: { some: { assigneeUserId: Number(userId) } } },
      ],
    },
    select: { id: true },
  });
  return !!project;
}
