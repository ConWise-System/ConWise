import * as msgService from "./messaging.service.js";
import { getIO } from "../../socket.js";
import catchAsync from "../../utils/catchAsync.js";


const handleError = (res, error, context) => {
  if (error.statusCode === 403) {
    return res.status(403).json({ success: false, message: error.message });
  }
  if (error.statusCode === 404) {
    return res.status(404).json({ success: false, message: error.message });
  }
  console.error(`Error in ${context}:`, error);
  return res
    .status(500)
    .json({ success: false, message: "Internal server error." });
};

const sendMessage = async (req, res) => {
  try{
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
  } catch(error){
     return handleError(res, error, "sendMessage");
  }
  
};

const getChatHistory = async (req, res) => {
  try{
   let { receiverUserId } = req.query; 
  const currentUserId = req.user.id;

  // 1. Guard check: Ensure a target user ID exists
  if (!receiverUserId) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid receiverUserId query parameter.",
    });
  }

  // 2. Defensive handling: If query param arrives duplicated as an array [id, id], grab the first item
  if (Array.isArray(receiverUserId)) {
    receiverUserId = receiverUserId[0];
  }

  // 3. Fetch purely 1-to-1 direct messaging history logs
  const history = await msgService.getPrivateHistory(
    Number(currentUserId),
    Number(receiverUserId)
  );

  res.status(200).json({
    success: true,
    data: history,
  });
  }catch(error){
    return handleError(res, error, "getChatHistory");
  }
  
};

export default {
  sendMessage,
  getChatHistory,
};
