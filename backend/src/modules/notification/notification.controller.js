import * as notificationService from "./notification.service.js";
import catchAsync from "../../utils/catchAsync.js";

// ─── Shared error handler ─────────────────────────────────────────────────────
const handleError = (res, error, context) => {
  if (error.statusCode === 403) {
    return res.status(403).json({ success: false, message: error.message });
  }
  if (error.statusCode === 404) {
    return res.status(404).json({ success: false, message: error.message });
  }
  if (error.statusCode === 409) {
    return res.status(409).json({ success: false, message: error.message });
  }
  console.error(`Error in ${context}:`, error);
  return res
    .status(500)
    .json({ success: false, message: "Internal server error." });
};

export const getMyNotifications = catchAsync(async (req, res) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.user.id);
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    handleError(res, error, "getMyNotifications");
  }
});

export const getUnreadCount = catchAsync(async (req, res) => {
  try {
    const count = await notificationService.countUnread(req.user.id);
    res.status(200).json({ success: true, data: { unreadCount: count } });
  } catch (error) {
    handleError(res, error, "getUnreadCount");
  }
});

export const markRead = catchAsync(async (req, res) => {
  try {
    await notificationService.markAsRead(Number(req.params.id), req.user.id);
    res.status(200).json({ success: true, message: "Marked as read" });
  } catch (error) {
    handleError(res, error, "markRead");
  }
});

export const markAllRead = catchAsync(async (req, res) => {
  try {
    await notificationService.markAllAsRead(req.user.id);
    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    handleError(res, error, "markAllRead");
  }
});