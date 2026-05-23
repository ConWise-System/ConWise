import express from "express";
import * as notificationController from "./notification.controller.js";
import authenticate from "../../middlewares/auth.middleware.js";

const router = express.Router();

// All notification routes require a logged-in user
router.use(authenticate);

// GET /api/notifications -> Get all notifications for the user
router.get("/", notificationController.getMyNotifications);

// GET /api/notifications/unread-count -> For the badge on the bell icon
router.get("/unread-count", notificationController.getUnreadCount);

// PATCH /api/notifications/:id/read -> Mark a specific one as read
router.patch("/:id/read", notificationController.markRead);

// PATCH /api/notifications/read-all -> Mark everything as read
router.patch("/read-all", notificationController.markAllRead);

export default router;
