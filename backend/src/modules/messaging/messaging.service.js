import prisma from "../../config/prisma.js";

export const saveMessage = async (senderId, companyId, data) => {
  const { projectId, receiverUserId, messageContent, chatType } = data;

  // Security Check for Private Messages
  if (receiverUserId) {
    const receiver = await prisma.user.findFirst({
      where: { id: receiverUserId, companyId: companyId }
    });
    if (!receiver) throw new Error("Recipient must be in the same company");
  }

  return await prisma.chat.create({
    data: {
      senderUserId: senderId,
      projectId: projectId || null,
      receiverUserId: receiverUserId || null,
      messageContent,
      chatType,
    },
    include: {
      sender: { select: { firstName: true, lastName: true, role: true } },
    },
  });
};

export const getProjectHistory = async (projectId) => {
  return await prisma.chat.findMany({
    where: { projectId: Number(projectId) },
    include: {
      sender: { select: { firstName: true, lastName: true, role: true } },
    },
    orderBy: { timestamp: "asc" },
  });
};

// Fetch Private 1-to-1 Chat History
export const getPrivateHistory = async (userA, userB) => {
  return await prisma.chat.findMany({
    where: {
      OR: [
        { senderUserId: userA, receiverUserId: userB },
        { senderUserId: userB, receiverUserId: userA },
      ]
    },
    include: {
      sender: { 
        select: { 
          firstName: true, 
          lastName: true, 
          role: true 
        } 
      },
    },
    orderBy: { 
      timestamp: "asc" 
    },
  });
};