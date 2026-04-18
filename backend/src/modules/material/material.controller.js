import { materialService, costSummaryService } from "./material.service.js";

// ─── Shared error handler ─────────────────────────────────────────────────────
const handleError = (res, error, context) => {
  if (error.statusCode === 403) {
    return res.status(403).json({ success: false, message: error.message });
  }
  if (error.statusCode === 404) {
    return res.status(404).json({ success: false, message: error.message });
  }
  if (error.statusCode === 409) {
    return res.status(409).json({ success: false, message: error.message });
  }
  console.error(`Error in ${context}:`, error);
  return res
    .status(500)
    .json({ success: false, message: "Internal server error." });
};

// ─── Material controllers ─────────────────────────────────────────────────────
export const materialController = {
  // POST /api/materials
  createMaterial: async (req, res) => {
    try {
      const { id: userId, role, companyId } = req.user;

      const material = await materialService.createMaterial({
        ...req.body,
        companyId,
      });
      return res.status(201).json({
        success: true,
        message: "Material created successfully.",
        data: material,
      });
    } catch (error) {
      return handleError(res, error, "createMaterial");
    }
  },

  // GET /api/materials
  getAllMaterials: async (req, res) => {
    try {
      const { companyId } = req.user;
      const { take, skip } = req.query;

      const materials = await materialService.getAllMaterials({
        companyId,
        take,
        skip,
      });
      return res.status(200).json({
        success: true,
        data: materials,
        count: materials.length,
      });
    } catch (error) {
      return handleError(res, error, "getAllMaterials");
    }
  },

  // GET /api/materials/:id
  getMaterialById: async (req, res) => {
    try {
      if (!/^\d+$/.test(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid material ID.",
        });
      }
      const materialId = Number(req.params.id);
      if (!Number.isInteger(materialId) || materialId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid material ID.",
        });
      }

      const { companyId } = req.user;

      const material = await materialService.getMaterialById(
        materialId,
        companyId,
      );
      if (!material) {
        return res.status(404).json({
          success: false,
          message: "Material not found.",
        });
      }

      return res.status(200).json({ success: true, data: material });
    } catch (error) {
      return handleError(res, error, "getMaterialById");
    }
  },

  // PATCH /api/materials/:id
  updateMaterial: async (req, res) => {
    try {
      if (!/^\d+$/.test(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid material ID.",
        });
      }
      const materialId = Number(req.params.id);
      if (!Number.isInteger(materialId) || materialId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid material ID.",
        });
      }

      const { id: userId, role, companyId } = req.user;

      const material = await materialService.updateMaterial({
        materialId,
        updateData: req.body,
        userId,
        role,
        companyId,
      });

      if (!material) {
        return res.status(404).json({
          success: false,
          message: "Material not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Material updated successfully.",
        data: material,
      });
    } catch (error) {
      return handleError(res, error, "updateMaterial");
    }
  },

  // DELETE /api/materials/:id
  deleteMaterial: async (req, res) => {
    try {
      if (!/^\d+$/.test(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid material ID.",
        });
      }
      const materialId = Number(req.params.id);
      if (!Number.isInteger(materialId) || materialId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid material ID.",
        });
      }

      const { role } = req.user;

      const deleted = await materialService.deleteMaterial({
        materialId,
        role,
        companyId: req.user.companyId,
      });

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Material not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: deleted.materialName
          ? `Material "${deleted.materialName}" deleted successfully.`
          : "Material deleted successfully.",
        data: { id: deleted.id },
      });
    } catch (error) {
      return handleError(res, error, "deleteMaterial");
    }
  },
};

// ─── CostSummary controllers ──────────────────────────────────────────────────
export const costSummaryController = {
  // GET /api/projects/:projectId/cost-summary
  getCostSummary: async (req, res) => {
    try {
      if (!/^\d+$/.test(req.params.projectId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID.",
        });
      }
      const projectId = Number(req.params.projectId);
      if (!Number.isInteger(projectId) || projectId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID.",
        });
      }

      const { companyId } = req.user;

      const summary = await costSummaryService.getCostSummary({
        projectId,
        companyId,
      });

      if (!summary) {
        return res.status(404).json({
          success: false,
          message: "Cost summary not found for this project.",
        });
      }

      return res.status(200).json({ success: true, data: summary });
    } catch (error) {
      return handleError(res, error, "getCostSummary");
    }
  },

  // PUT /api/projects/:projectId/cost-summary
  upsertCostSummary: async (req, res) => {
    try {
      if (!/^\d+$/.test(req.params.projectId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID.",
        });
      }
      const projectId = Number(req.params.projectId);
      if (!Number.isInteger(projectId) || projectId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID.",
        });
      }

      const { companyId } = req.user;
      const { estimatedCost, actualTaskCost } = req.body;

      // Validate estimatedCost
      const parsedEstimatedCost = Number(estimatedCost);
      if (!Number.isFinite(parsedEstimatedCost) || parsedEstimatedCost < 0) {
        return res.status(400).json({
          success: false,
          message: "Estimated cost must be a non-negative number.",
        });
      }

      // Validate actualTaskCost
      const parsedActualTaskCost = Number(actualTaskCost);
      if (!Number.isFinite(parsedActualTaskCost) || parsedActualTaskCost < 0) {
        return res.status(400).json({
          success: false,
          message: "Actual task cost must be a non-negative number.",
        });
      }

      const summary = await costSummaryService.upsertCostSummary({
        projectId,
        companyId,
        estimatedCost: parsedEstimatedCost,
        actualTaskCost: parsedActualTaskCost,
      });

      return res.status(200).json({
        success: true,
        message: "Cost summary updated successfully.",
        data: summary,
      });
    } catch (error) {
      return handleError(res, error, "upsertCostSummary");
    }
  },
};
