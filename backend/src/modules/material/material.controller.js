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

// ─── ID parser helper ─────────────────────────────────────────────────────────
// FIX(CodeRabbit): parseInt parses partial strings ("12abc" → 12) and
// isNaN is redundant after parseInt. Use regex + Number() instead for
// strict integer validation
const parsePositiveInt = (value) => {
  if (!/^\d+$/.test(value)) return null;
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

// ─── Material controllers ─────────────────────────────────────────────────────
export const materialController = {
  // POST /api/materials
  // FIX(CodeRabbit): Removed unused `userId` and `role` destructuring
  createMaterial: async (req, res) => {
    try {
      const { companyId } = req.user;

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
  // FIX(CodeRabbit): Pagination count may be misleading — renamed to `total`
  // and parse take/skip safely before passing to service
  getAllMaterials: async (req, res) => {
    try {
      const { companyId } = req.user;
      const take = Number.parseInt(req.query.take, 10);
      const skip = Number.parseInt(req.query.skip, 10);

      const parsedTake = Number.isInteger(take) && take > 0 ? take : 20;
      const parsedSkip = Number.isInteger(skip) && skip >= 0 ? skip : 0;

      const { materials, total } = await materialService.getAllMaterials({
        companyId,
        take: parsedTake,
        skip: parsedSkip,
      });

      return res.status(200).json({
        success: true,
        data: materials,
        total,
      });
    } catch (error) {
      return handleError(res, error, "getAllMaterials");
    }
  },

  // GET /api/materials/:id
  getMaterialById: async (req, res) => {
    try {
      const materialId = parsePositiveInt(req.params.id);
      if (!materialId) {
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
      const materialId = parsePositiveInt(req.params.id);
      if (!materialId) {
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
      const materialId = parsePositiveInt(req.params.id);
      if (!materialId) {
        return res.status(400).json({
          success: false,
          message: "Invalid material ID.",
        });
      }

      const { role, companyId } = req.user;

      const deleted = await materialService.deleteMaterial({
        materialId,
        role,
        companyId,
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
  // GET /api/materials/projects/:projectId/cost-summary
  getCostSummary: async (req, res) => {
    try {
      const projectId = parsePositiveInt(req.params.projectId);
      if (!projectId) {
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

  // PUT /api/materials/projects/:projectId/cost-summary
  // FIX(CodeRabbit): Validate estimatedCost and actualTaskCost before
  // passing to service — Zod handles type validation but we add explicit
  // finite + non-negative guard here as a second layer
  upsertCostSummary: async (req, res) => {
    try {
      const projectId = parsePositiveInt(req.params.projectId);
      if (!projectId) {
        return res.status(400).json({
          success: false,
          message: "Invalid project ID.",
        });
      }

      const { companyId } = req.user;
      const { estimatedCost, actualTaskCost } = req.body;

      const parsedEstimatedCost = Number(estimatedCost);
      if (!Number.isFinite(parsedEstimatedCost) || parsedEstimatedCost < 0) {
        return res.status(400).json({
          success: false,
          message: "Estimated cost must be a non-negative number.",
        });
      }

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
