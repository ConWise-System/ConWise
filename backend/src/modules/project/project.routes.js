import express from "express";
import { projectController } from "./project.controller.js";
import { validateBody, createProjectSchema } from "./project.validation.js";
import authenticate from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";
import { ROLES } from "../../config/constants.js";

const router = express.Router();

// All project routes require authentication
router.use(authenticate);

// POST /api/projects — Only COMPANY_ADMIN and PROJECT_MANAGER can create
router.post(
  "/",
  authorizeRoles(ROLES.COMPANY_ADMIN, ROLES.PROJECT_MANAGER),
  validateBody(createProjectSchema),
  projectController.createProject,
);

// GET /api/projects — All roles can list projects
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

// GET /api/projects/:id — All roles can view project detail
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

export default router;
