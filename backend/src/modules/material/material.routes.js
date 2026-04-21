import express from "express";
import {
  materialController,
  costSummaryController,
} from "./material.controller.js";
import {
  validateBody,
  createMaterialSchema,
  updateMaterialSchema,
  upsertCostSummarySchema,
} from "./material.validation.js";
import authenticate from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";
import { ROLES } from "../../config/constants.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// ─── MaterialUsed routes ──────────────────────────────────────────────────────

/**
 * @swagger
 * /api/materials:
 *   post:
 *     summary: Create a new material record
 *     tags: [Materials]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMaterialRequest'
 *     responses:
 *       201:
 *         description: Material created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MaterialResponse'
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 */
router.post(
  "/",
  authorizeRoles(
    ROLES.COMPANY_ADMIN,
    ROLES.PROJECT_MANAGER,
    ROLES.SITE_ENGINEER,
  ),
  validateBody(createMaterialSchema),
  materialController.createMaterial,
);

/**
 * @swagger
 * /api/materials:
 *   get:
 *     summary: List all materials for the authenticated company
 *     tags: [Materials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *         description: Number of records to return
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *         description: Number of records to skip
 *     responses:
 *       200:
 *         description: List of materials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MaterialListResponse'
 */
router.get(
  "/",
  authorizeRoles(
    ROLES.COMPANY_ADMIN,
    ROLES.PROJECT_MANAGER,
    ROLES.SITE_ENGINEER,
    ROLES.SITE_SUPERVISOR,
  ),
  materialController.getAllMaterials,
);

// ─── CostSummary routes ───────────────────────────────────────────────────────
// FIX(CodeRabbit): Route path mismatch — cost summary routes were defined
// as /projects/:projectId/cost-summary inside the material router which is
// mounted at /api/materials, making the actual path:
//   /api/materials/projects/:projectId/cost-summary
// Swagger docs now match this actual path exactly.
// IMPORTANT: these must be defined BEFORE /:id to avoid Express matching
// "projects" as a material ID param

/**
 * @swagger
 * /api/materials/projects/{projectId}/cost-summary:
 *   get:
 *     summary: Get cost summary for a project
 *     tags: [Cost Summary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cost summary data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CostSummaryResponse'
 *       404:
 *         description: Cost summary or project not found
 */
router.get(
  "/projects/:projectId/cost-summary",
  authorizeRoles(ROLES.COMPANY_ADMIN, ROLES.PROJECT_MANAGER),
  costSummaryController.getCostSummary,
);

/**
 * @swagger
 * /api/materials/projects/{projectId}/cost-summary:
 *   put:
 *     summary: Create or update cost summary for a project
 *     tags: [Cost Summary]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpsertCostSummaryRequest'
 *     responses:
 *       200:
 *         description: Cost summary updated. costVariance is computed server-side.
 *       400:
 *         description: Validation error
 *       404:
 *         description: Project not found
 */
router.put(
  "/projects/:projectId/cost-summary",
  authorizeRoles(ROLES.COMPANY_ADMIN, ROLES.PROJECT_MANAGER),
  validateBody(upsertCostSummarySchema),
  costSummaryController.upsertCostSummary,
);

// ─── These routes must come AFTER /projects/:projectId/cost-summary ──────────
// to prevent Express from matching "projects" as a material :id param

/**
 * @swagger
 * /api/materials/{id}:
 *   get:
 *     summary: Get a material by ID
 *     tags: [Materials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Material detail with linked tasks
 *       404:
 *         description: Material not found
 */
router.get(
  "/:id",
  authorizeRoles(
    ROLES.COMPANY_ADMIN,
    ROLES.PROJECT_MANAGER,
    ROLES.SITE_ENGINEER,
    ROLES.SITE_SUPERVISOR,
  ),
  materialController.getMaterialById,
);

/**
 * @swagger
 * /api/materials/{id}:
 *   patch:
 *     summary: Update a material record
 *     tags: [Materials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMaterialRequest'
 *     responses:
 *       200:
 *         description: Material updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Material not found
 */
router.patch(
  "/:id",
  authorizeRoles(
    ROLES.COMPANY_ADMIN,
    ROLES.PROJECT_MANAGER,
    ROLES.SITE_ENGINEER,
  ),
  validateBody(updateMaterialSchema),
  materialController.updateMaterial,
);

/**
 * @swagger
 * /api/materials/{id}:
 *   delete:
 *     summary: Delete a material record
 *     tags: [Materials]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Material deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Material not found
 *       409:
 *         description: Conflict - material still linked to tasks
 */
router.delete(
  "/:id",
  authorizeRoles(ROLES.COMPANY_ADMIN, ROLES.PROJECT_MANAGER),
  materialController.deleteMaterial,
);

export default router;
