import * as msgService from "./messaging.service.js";
import { getIO } from "../../socket.js";
import catchAsync from "../../utils/catchAsync.js";

const sendMessage = catchAsync(async (req, res) => {
  const senderId = req.user.id;
  const companyId = req.user.companyId;

  const savedMessage = await msgService.saveMessage(
    senderId,
    companyId,
    req.body,
  );
  const io = getIO();

  if (req.body.projectId) {
    // BROADCAST TO GROUP: project_room
    io.to(`project_${req.body.projectId}`).emit("new_message", savedMessage);
  } else {
    // BROADCAST TO PRIVATE: receiver's personal room
    io.to(`user_${req.body.receiverUserId}`).emit("new_message", savedMessage);
    // Also broadcast to sender's room (to sync multiple tabs/devices)
    io.to(`user_${senderId}`).emit("new_message", savedMessage);
  }

  res.status(201).json({ success: true, data: savedMessage });
});

const getChatHistory = catchAsync(async (req, res) => {
  const { projectId, receiverUserId } = req.query; // Using query params
  const currentUserId = req.user.id;

  let history;

  if (projectId) {
    // 1. Get Group History
    history = await msgService.getProjectHistory(projectId);
  } else if (receiverUserId) {
    // 2. Get Private History
    history = await msgService.getPrivateHistory(
      currentUserId,
      Number(receiverUserId),
    );
  } else {
    return res.status(400).json({
      success: false,
      message: "Please provide either projectId or receiverUserId",
    });
  }

  res.status(200).json({
    success: true,
    data: history,
  });
});

export default {
  sendMessage,
  getChatHistory,
};
