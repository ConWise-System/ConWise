import prisma from "../../config/prisma.js";
import { getIO } from "../../socket.js";

export const createNotification = async (data) => {
  const notification = await prisma.notification.create({ data });

  // Real-time push
  const io = getIO();
  if (io) {
    const room = `notify_${String(data.recipientUserId)}`;
    io.to(room).emit("new_notification", notification);

    // Also push the updated count so the Bell icon updates instantly
    const unreadCount = await countUnread(data.recipientUserId);
    io.to(room).emit("unread_count_update", { unreadCount });
  }
  return notification;
};

export const getUserNotifications = async (userId) => {
  return await prisma.notification.findMany({
    where: { recipientUserId: userId },
    orderBy: { notifiedDate: "desc" },
    take: 30,
  });
};

export const markAsRead = async (id, userId) => {
  return await prisma.notification.update({
    where: { id, recipientUserId: userId },
    data: { isRead: true },
  });
};

export const markAllAsRead = async (userId) => {
  return await prisma.notification.updateMany({
    where: { recipientUserId: userId, isRead: false },
    data: { isRead: true },
  });
};

export const countUnread = async (userId) => {
  return await prisma.notification.count({
    where: { recipientUserId: userId, isRead: false },
  });
};
