import { Server } from "socket.io";

let io;
// Key-value store: [userId]: socketId
const onlineUsers = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`⚡ User Connected: ${socket.id}`);

    // Join private 1-to-1 chat channel
    socket.on("join_private", (userId) => {
      const roomName = `user_${userId}`;
      socket.join(roomName);
      
      // 1. Save user to our global active connection map
      onlineUsers.set(userId.toString(), socket.id);
      console.log(`💬 User ${userId} bound to room: ${roomName}. Total active: ${onlineUsers.size}`);

      // 2. Broadcast the list of currently online user IDs to everyone
      io.emit("update_online_users", Array.from(onlineUsers.keys()));
    });

    // Join notifications channel
    socket.on("join_notifications", (userId) => {
      socket.join(`notify_${userId}`);
    });

    // Universal private message router
    socket.on("send_private_message", (messagePayload) => {
      const { senderUserId, receiverUserId } = messagePayload;
      if (!senderUserId || !receiverUserId) return;

      const receiverRoom = `user_${receiverUserId}`;
      const senderRoom = `user_${senderUserId}`;

      io.to(receiverRoom).emit("receive_private_message", messagePayload);
      io.to(senderRoom).emit("receive_private_message", messagePayload);
    });

    // Handle user disconnecting
    socket.on("disconnect", () => {
      console.log(`❌ User Disconnected: ${socket.id}`);
      
      // 3. Find who owned this socket connection and clear them out
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`👤 User ${userId} went offline.`);
          break;
        }
      }

      // 4. Send the updated online user lists to all remaining clients
      io.emit("update_online_users", Array.from(onlineUsers.keys()));
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};