import { projectService } from "./project.service.js";

// ─── Shared error handler ─────────────────────────────────────────────────────
const handleError = (res, error, context) => {
  if (error.statusCode === 403) {
    return res.status(403).json({ success: false, message: error.message });
  }
  if (error.statusCode === 404) {
    return res.status(404).json({ success: false, message: error.message });
  }
  console.error(`Error in ${context}:`, error);
  return res
    .status(500)
    .json({ success: false, message: "Internal server error." });
};

// ─── ID parser helper ─────────────────────────────────────────────────────────
// FIX(CodeRabbit): Validate project ID is a strict positive integer
// parseInt("12abc") = 12 — use regex + Number() for strict validation
const parsePositiveInt = (value) => {
  if (!/^\d+$/.test(value)) return null;
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

export const projectController = {
  // POST /api/projects
  createProject: async (req, res) => {
    try {
      // FIX(CodeRabbit): Guard against undefined req.user
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      const { id: ownerUserId, companyId } = req.user;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          q: "User is not associated with a company.",
        });
      }

      const project = await projectService.createProject({
        ownerUserId,
        companyId,
        projectData: req.body,
      });

      return res.status(201).json({
        success: true,
        message: "Project created successfully.",
        data: project,
      });
    } catch (error) {
      return handleError(res, error, "createProject");
    }
  },

  // GET /api/projects
  getAllProjects: async (req, res) => {
    try {
      // FIX(CodeRabbit): Guard against undefined req.user
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      const { id: userId, companyId, role } = req.user;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: "User is not associated with a company.",
        });
      }

      const projects = await projectService.getAllProjects({
        companyId,
        userId,
        role,
      });

      return res.status(200).json({
        success: true,
        message: "Projects retrieved successfully.",
        data: projects,
      });
    } catch (error) {
      return handleError(res, error, "getAllProjects");
    }
  },

  // GET /api/projects/:id
  getProjectById: async (req, res) => {
    try {
      // FIX(CodeRabbit): Guard against undefined req.user
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      // FIX(CodeRabbit): Validate project ID as strict positive integer
      const projectId = parsePositiveInt(req.params.id);
      if (!projectId) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID. Must be a positive integer.",
        });
      }

      const { id: userId, companyId, role } = req.user;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: "User is not associated with a company.",
        });
      }

      const project = await projectService.getProjectById({
        projectId,
        companyId,
        userId,
        role,
      });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Project not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Project retrieved successfully.",
        data: project,
      });
    } catch (error) {
      return handleError(res, error, "getProjectById");
    }
  },

  // DELETE /api/projects/:id
  deleteProject: async (req, res) => {
    try {
      // FIX(CodeRabbit): Guard against undefined req.user
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      // FIX(CodeRabbit): Validate project ID as strict positive integer
      const projectId = parsePositiveInt(req.params.id);
      if (!projectId) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID. Must be a positive integer.",
        });
      }

      const { id: userId, companyId, role } = req.user;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: "User is not associated with a company.",
        });
      }

      const deleted = await projectService.deleteProject({
        projectId,
        companyId,
        userId,
        role,
      });

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Project not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: deleted.projectName
          ? `Project "${deleted.projectName}" deleted successfully.`
          : "Project deleted successfully.",
        data: { id: deleted.id },
      });
    } catch (error) {
      return handleError(res, error, "deleteProject");
    }
  },
};
