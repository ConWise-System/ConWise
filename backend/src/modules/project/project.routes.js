import express from "express";
import { projectController } from "./project.controller.js";
import { validateBody, createProjectSchema } from "./project.validation.js";
import authenticate from "../../middlewares/auth.middleware.js";

const router = express.Router();

// All project routes are protected
router.use(authenticate);

// POST /api/projects — Create a new project
router.post(
  "/",
  validateBody(createProjectSchema),
  projectController.createProject,
);

// GET /api/projects — List all projects for the company
router.get("/", projectController.getAllProjects);

// GET /api/projects/:id — Get single project detail
router.get("/:id", projectController.getProjectById);

export default router;
