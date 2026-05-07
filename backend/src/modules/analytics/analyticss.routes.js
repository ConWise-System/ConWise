import express from "express";
import analyticssController from "./analyticss.controller.js";
import authenticate from "../../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// ─── Dashboard ────────────────────────────────────────────────────────────────
// GET /api/analytics/dashboard-summary — Role-scoped dashboard data
router.get("/dashboard-summary", analyticssController.getDashboardSummary);

export default router;
