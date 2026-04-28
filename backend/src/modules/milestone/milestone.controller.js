import { milestoneService } from "./milestone.service.js";

const parsePositiveInt = (value) => {
  if (!/^\d+$/.test(value)) return null;
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

const handleError = (res, error, context) => {
  if (error.statusCode === 404) {
    return res.status(404).json({ success: false, message: error.message });
  }

  console.error(`Error in ${context}:`, error);
  return res.status(500).json({ success: false, message: "Internal server error" });
};

export const milestoneController = {
  getProjectMilestones: async (req, res) => {
    try {
      const projectId = parsePositiveInt(req.params.projectId);
      if (!projectId) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID. Must be a positive integer.",
        });
      }

      const data = await milestoneService.getProjectMilestones(projectId);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return handleError(res, error, "getProjectMilestones");
    }
  },

  getTaskMilestoneByProject: async (req, res) => {
    try {
      const projectId = parsePositiveInt(req.params.projectId);
      const taskId = parsePositiveInt(req.params.taskId);

      if (!projectId) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID. Must be a positive integer.",
        });
      }

      if (!taskId) {
        return res.status(400).json({
          success: false,
          message: "Invalid task ID. Must be a positive integer.",
        });
      }

      const data = await milestoneService.getTaskMilestoneByProject(projectId, taskId);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return handleError(res, error, "getTaskMilestoneByProject");
    }
  },
};
