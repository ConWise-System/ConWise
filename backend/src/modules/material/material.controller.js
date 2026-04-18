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
      const material = await materialService.createMaterial(req.body);
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
      const materials = await materialService.getAllMaterials();
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
      const materialId = parseInt(req.params.id);
      if (!materialId || isNaN(materialId) || materialId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid material ID.",
        });
      }

      const material = await materialService.getMaterialById(materialId);
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
      const materialId = parseInt(req.params.id);
      if (!materialId || isNaN(materialId) || materialId <= 0) {
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
      const materialId = parseInt(req.params.id);
      if (!materialId || isNaN(materialId) || materialId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid material ID.",
        });
      }

      const { role } = req.user;

      const deleted = await materialService.deleteMaterial({
        materialId,
        role,
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
      const projectId = parseInt(req.params.projectId);
      if (!projectId || isNaN(projectId) || projectId <= 0) {
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
      const projectId = parseInt(req.params.projectId);
      if (!projectId || isNaN(projectId) || projectId <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID.",
        });
      }

      const { companyId } = req.user;
      const { estimatedCost, actualTaskCost } = req.body;

      const summary = await costSummaryService.upsertCostSummary({
        projectId,
        companyId,
        estimatedCost,
        actualTaskCost,
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
