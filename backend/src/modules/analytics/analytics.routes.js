import express from "express";
import { analyticsController } from "./analytics.controller.js";
import authenticate from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";
import { ROLES } from "../../config/constants.js";

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/projects/{projectId}/analytics:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get project analytics
 *     description: Aggregated task, timeline, and issue metrics for a project.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully
 *       400:
 *         description: Invalid project ID or user without company
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Project not found
 */
router.get(
  "/projects/:projectId/analytics",
  authorizeRoles(
    ROLES.COMPANY_ADMIN,
    ROLES.PROJECT_MANAGER,
    ROLES.SITE_ENGINEER,
    ROLES.SITE_SUPERVISOR,
  ),
  analyticsController.getProjectAnalytics,
);

export default router;


/**
 * @swagger
 * /api/projects/{projectId}/cost-summary:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get project cost summary
 *     description: Provides budget, actual costs, variance, utilization, and cost trends.
 */
router.get(
  "/projects/:projectId/cost-summary",
  authorizeRoles(
    ROLES.COMPANY_ADMIN,
    ROLES.PROJECT_MANAGER,
    ROLES.SITE_ENGINEER,
    ROLES.SITE_SUPERVISOR,
  ),
  analyticsController.getCostSummary,
);