import { projectService } from "./project.service.js";

export const projectController = {
  // POST /api/projects
  createProject: async (req, res) => {
    try {
      const ownerUserId = req.user.id;
      const companyId = req.user.companyId;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: "User is not associated with a company.",
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
      console.error("Error in createProject:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  },

  // GET /api/projects
  getAllProjects: async (req, res) => {
    try {
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
      console.error("Error in getAllProjects:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  },

  // GET /api/projects/:id
  getProjectById: async (req, res) => {
    try {
      const projectId = Number(req.params.id);
      const { id: userId, companyId, role } = req.user;

      if (!projectId || isNaN(projectId) || projectId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID.",
        });
      }

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
      console.error("Error in getProjectById:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  },

  // DELETE /api/projects/:id
  deleteProject: async (req, res) => {
    try {
      const projectId = Number(req.params.id);
      const { id: userId, companyId, role } = req.user;

      if (!projectId || isNaN(projectId) || projectId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID.",
        });
      }

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
      // Handle ownership error thrown from service
      if (error.statusCode === 403) {
        return res.status(403).json({
          success: false,
          message: error.message,
        });
      }
      console.error("Error in deleteProject:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  },
};
