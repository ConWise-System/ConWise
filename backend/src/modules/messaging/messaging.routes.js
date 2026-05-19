import express from "express";
import messagingController from "./messaging.controller.js";
import validate from "../../middlewares/validate.middleware.js";
import authenticate from "../../middlewares/auth.middleware.js";
import {
  sendMessageSchema,
  getPrivateChatHistorySchema,
} from "./messaging.validation.js";

const router = express.Router();

// All users must be logged in to use chat
router.use(authenticate);

// Send a message (Project Group Chat)
router.post(
  "/send",
  validate(sendMessageSchema, "body"),
  messagingController.sendMessage,
);

// Get history for a specific person
router.get(
  "/history/private",
  validate(getPrivateChatHistorySchema, "query"),
  messagingController.getChatHistory,
);

export default router;
