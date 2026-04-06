import express from "express";
import { projectController } from "./project.controller.js";
import { validateBody, createProjectSchema } from "./project.validation.js";
import authenticate from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";
import { ROLES } from "../../config/constants.js";

const router = express.Router();

// All project routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     tags:
 *       - Projects
 *     summary: Create a new construction project
 *     description: Creates a new project and automatically initializes its progress record. Only accessible by Company Admin and Project Manager.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProjectRequest'
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       400:
 *         description: Validation error or user not associated with a company
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       403:
 *         description: Forbidden - Only Company Admin or Project Manager can create projects
 */
router.post(
  "/",
  authorizeRoles(ROLES.COMPANY_ADMIN, ROLES.PROJECT_MANAGER),
  validateBody(createProjectSchema),
  projectController.createProject,
);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     tags:
 *       - Projects
 *     summary: List all projects
 *     description: Returns all projects for the company. Site Engineers and Supervisors only see projects they are assigned to via tasks.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectListResponse'
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       403:
 *         description: Forbidden - Insufficient role permissions
 */
router.get(
  "/",
  authorizeRoles(
    ROLES.COMPANY_ADMIN,
    ROLES.PROJECT_MANAGER,
    ROLES.SITE_ENGINEER,
    ROLES.SITE_SUPERVISOR,
  ),
  projectController.getAllProjects,
);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Get project by ID
 *     description: Returns full project detail including progress, owner, cost summary, and counts. Site Engineers and Supervisors can only view projects they are assigned to.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectResponse'
 *       400:
 *         description: Invalid project ID
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       403:
 *         description: Forbidden - Insufficient role permissions
 *       404:
 *         description: Project not found
 */
router.get(
  "/:id",
  authorizeRoles(
    ROLES.COMPANY_ADMIN,
    ROLES.PROJECT_MANAGER,
    ROLES.SITE_ENGINEER,
    ROLES.SITE_SUPERVISOR,
  ),
  projectController.getProjectById,
);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     tags:
 *       - Projects
 *     summary: Delete a project
 *     description: Permanently deletes a project and all its related data including tasks, reports, issues, chats, and progress records. Project Manager can only delete their own projects. This action is irreversible.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteProjectResponse'
 *       400:
 *         description: Invalid project ID
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       403:
 *         description: Forbidden - Only Company Admin or Project Manager can delete. Project Manager can only delete their own projects.
 *       404:
 *         description: Project not found
 */
router.delete(
  "/:id",
  authorizeRoles(ROLES.COMPANY_ADMIN, ROLES.PROJECT_MANAGER),
  projectController.deleteProject,
);

export default router;
