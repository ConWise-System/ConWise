import express from "express";
import authenticate from "../../middlewares/auth.middleware.js";
import { milestoneController } from "./milestone.controller.js";

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/milestones/{projectId}:
 *   get:
 *     tags: [Milestones]
 *     summary: Get milestone aggregation for a project
 *     description: Returns aggregated milestone/task status counts and completion percentage for the specified project.
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
 *         description: Milestone aggregation retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     projectId:
 *                       type: string
 *                     projectName:
 *                       type: string
 *                     projectStartDate:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     projectDueDate:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     completedTasks:
 *                       type: integer
 *                     inProgressTasks:
 *                       type: integer
 *                     underReviewTasks:
 *                       type: integer
 *                     blockedTasks:
 *                       type: integer
 *                     rejectedTasks:
 *                       type: integer
 *                     totalTasks:
 *                       type: integer
 *                     completionPercentage:
 *                       type: number
 *       400:
 *         description: Invalid project ID
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       404:
 *         description: Project not found
 *       500:
 *         description: Internal server error
 */
router.get("/my-projects", milestoneController.getProjectManagerMilestones);

/**
 * @swagger
 * /api/milestones/{projectId}/{taskId}:
 *   get:
 *     tags: [Milestones]
 *     summary: Get milestone detail for a task in a project
 *     description: Returns milestone detail for a specific task under the specified project.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task milestone detail retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     projectId:
 *                       type: string
 *                     taskId:
 *                       type: string
 *                     projectName:
 *                       type: string
 *                     taskName:
 *                       type: string
 *                     taskStartDate:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     taskDueDate:
 *                       type: string
 *                       format: date-time
 *                     taskStatus:
 *                       type: string
 *       400:
 *         description: Invalid project ID or task ID
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       404:
 *         description: Project not found or task not found for the given project
 *       500:
 *         description: Internal server error
 */
// router.get("/:projectId/:taskId", milestoneController.getTaskMilestoneByProject);

export default router;
