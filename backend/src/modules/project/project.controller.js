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
      const companyId = req.user.companyId;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: "User is not associated with a company.",
        });
      }

      const projects = await projectService.getAllProjects({ companyId });

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
      const companyId = req.user.companyId;

      if (isNaN(projectId)) {
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
};
