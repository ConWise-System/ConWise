import express from "express";
import messagingController from "./messaging.controller.js";
import validate from "../../middlewares/validate.middleware.js";
import authenticate from "../../middlewares/auth.middleware.js";
import {
  sendMessageSchema,
  getChatHistorySchema,
} from "./messaging.validation.js";

const router = express.Router();

// All users must be logged in to use chat
router.use(authenticate);

// Send a message (Project Group Chat)
router.post(
  "/send",
  validate(sendMessageSchema),
  messagingController.sendMessage,
);

// Get history for a specific project
router.get(
  "/history/:projectId",
  validate(getChatHistorySchema),
  messagingController.getChatHistory,
);

export default router;
