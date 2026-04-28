import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Adjust this to your frontend URL in production
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`⚡ User Connected: ${socket.id}`);

    // Join a Project Room
    socket.on("join_project", (projectId) => {
      socket.join(`project_${projectId}`);
    });

    // Join a private room for personal Direct Messages
    socket.on("join_private", (userId) => {
      socket.join(`user_${userId}`);
    });

    // 3. Join a room for System Notifications
    socket.on("join_notifications", (userId) => {
      socket.join(`notify_${userId}`);
      console.log(
        `🔔 User ${userId} joined notification room: notify_${userId}`,
      );
    });

    // Handle user disconnecting
    socket.on("disconnect", () => {
      console.log("❌ User disconnected");
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
