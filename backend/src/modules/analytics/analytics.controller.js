import { analyticsService } from "./analytics.service.js";

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

const parsePositiveInt = (value) => {
  if (!/^\d+$/.test(value)) return null;
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

export const analyticsController = {
  getProjectAnalytics: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      const projectId = parsePositiveInt(req.params.projectId);
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

      const data = await analyticsService.getProjectAnalytics({
        projectId,
        companyId,
        userId,
        role,
      });

      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Project not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Project analytics retrieved successfully.",
        data,
      });
    } catch (error) {
      return handleError(res, error, "getProjectAnalytics");
    }
  },
};
