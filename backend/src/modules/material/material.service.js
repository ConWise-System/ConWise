import { PrismaClient } from "../../generated/prisma/index.js";
import { ROLES } from "../../config/constants.js";
import { Decimal } from "decimal.js";

const prisma = new PrismaClient();

// ─── Decimal serializer ───────────────────────────────────────────────────────
const serializeMaterial = (material) => ({
  ...material,
  quantityUsed: material.quantityUsed?.toString(),
});

const serializeCostSummary = (summary) => ({
  ...summary,
  estimatedCost: summary.estimatedCost?.toString(),
  actualTaskCost: summary.actualTaskCost?.toString(),
  costVariance: summary.costVariance?.toString(),
});

// ─── Allowed fields for material update (whitelist) ──────────────────────────
// FIX(CodeRabbit): Whitelist allowed fields to prevent mass assignment
// Only these fields can be updated — any extra keys from the client are ignored
const ALLOWED_UPDATE_FIELDS = [
  "materialName",
  "quantityUsed",
  "unit",
  "usageDescription",
  "materialStatus",
];

const sanitizeUpdateData = (data) =>
  Object.fromEntries(
    Object.entries(data).filter(([key]) => ALLOWED_UPDATE_FIELDS.includes(key)),
  );

// ─── MaterialUsed service ─────────────────────────────────────────────────────
export const materialService = {
  // Create a new material record
  createMaterial: async (data) => {
    const material = await prisma.materialUsed.create({
      data: {
        companyId: data.companyId,
        materialName: data.materialName,
        quantityUsed: data.quantityUsed,
        unit: data.unit,
        usageDescription: data.usageDescription ?? null,
        materialStatus: data.materialStatus,
      },
    });
    return serializeMaterial(material);
  },

  // List all materials — company scoped with safe pagination
  getAllMaterials: async ({ companyId, take, skip }) => {
    if (!companyId) {
      throw new Error("Company ID is required for material access.");
    }

    // FIX(CodeRabbit): Validate pagination params to avoid NaN values
    // parseInt("abc") = NaN which would crash Prisma — guard with fallback
    const parsedTake = take !== undefined ? parseInt(take, 10) : undefined;
    const parsedSkip = skip !== undefined ? parseInt(skip, 10) : undefined;

    const safeTake =
      parsedTake !== undefined && !isNaN(parsedTake) && parsedTake > 0
        ? parsedTake
        : undefined;
    const safeSkip =
      parsedSkip !== undefined && !isNaN(parsedSkip) && parsedSkip >= 0
        ? parsedSkip
        : undefined;

    const materials = await prisma.materialUsed.findMany({
      where: { companyId },
      orderBy: { id: "desc" },
      take: safeTake,
      skip: safeSkip,
    });

    return materials.map(serializeMaterial);
  },

  // Get a single material by ID — company scoped
  getMaterialById: async (materialId, companyId) => {
    const material = await prisma.materialUsed.findFirst({
      where: { id: materialId, companyId },
      include: {
        tasks: {
          select: {
            id: true,
            taskTitle: true,
            taskStatus: true,
            project: {
              select: {
                id: true,
                projectName: true,
              },
            },
          },
        },
      },
    });
    if (!material) return null;
    return serializeMaterial(material);
  },

  // Update material fields
  // COMPANY_ADMIN and PROJECT_MANAGER: update any company material
  // SITE_ENGINEER: only materials linked to their assigned tasks
  updateMaterial: async ({
    materialId,
    updateData,
    userId,
    role,
    companyId,
  }) => {
    // Confirm material exists and belongs to this company
    const existing = await prisma.materialUsed.findFirst({
      where: { id: materialId, companyId },
      include: {
        tasks: {
          select: {
            assigneeUserId: true,
            project: { select: { companyId: true } },
          },
        },
      },
    });

    if (!existing) return null;

    // SITE_ENGINEER: can only update materials linked to their own tasks
    if (role === ROLES.SITE_ENGINEER) {
      const isAssigned = existing.tasks.some(
        (task) =>
          task.assigneeUserId === userId &&
          task.project?.companyId === companyId,
      );
      if (!isAssigned) {
        const error = new Error(
          "You can only update materials linked to your assigned tasks.",
        );
        error.statusCode = 403;
        throw error;
      }
    }

    // FIX(CodeRabbit): Whitelist allowed fields — strip any unexpected keys
    const safeUpdateData = sanitizeUpdateData(updateData);

    const updated = await prisma.materialUsed.update({
      where: { id: materialId },
      data: safeUpdateData,
    });

    return serializeMaterial(updated);
  },

  // Delete a material — whitelist role check
  // COMPANY_ADMIN: delete any material in the company
  // PROJECT_MANAGER: only if material is not linked to any tasks
  deleteMaterial: async ({ materialId, role, companyId }) => {
    const existing = await prisma.materialUsed.findFirst({
      where: { id: materialId, companyId },
      include: { tasks: { select: { id: true } } },
    });

    if (!existing) return null;

    if (role === ROLES.COMPANY_ADMIN) {
      // Full access — no extra check
    } else if (role === ROLES.PROJECT_MANAGER) {
      if (existing.tasks.length > 0) {
        const error = new Error(
          "Cannot delete a material that is still linked to tasks. Unlink it from all tasks first.",
        );
        error.statusCode = 409;
        throw error;
      }
    } else {
      const error = new Error(
        "You do not have permission to delete materials.",
      );
      error.statusCode = 403;
      throw error;
    }

    await prisma.materialUsed.delete({ where: { id: materialId } });

    return { id: materialId, materialName: existing.materialName };
  },
};

// ─── CostSummary service ──────────────────────────────────────────────────────
export const costSummaryService = {
  // Get cost summary for a project
  getCostSummary: async ({ projectId, companyId }) => {
    const project = await prisma.project.findFirst({
      where: { id: projectId, companyId },
    });
    if (!project) return null;

    const summary = await prisma.costSummary.findUnique({
      where: { projectId },
    });
    if (!summary) return null;

    return serializeCostSummary(summary);
  },

  // Upsert cost summary for a project
  // costVariance is always computed server-side: estimatedCost - actualTaskCost
  // FIX(CodeRabbit): Consistent null handling — use explicit 0 fallback
  // so Decimal arithmetic never receives null/undefined
  upsertCostSummary: async ({
    projectId,
    companyId,
    estimatedCost,
    actualTaskCost,
  }) => {
    const project = await prisma.project.findFirst({
      where: { id: projectId, companyId },
    });

    if (!project) {
      const error = new Error(
        "Project not found or does not belong to your company.",
      );
      error.statusCode = 404;
      throw error;
    }

    // FIX(CodeRabbit): Guard against null/undefined before Decimal arithmetic
    // Both values validated as non-negative numbers by Zod before reaching here
    // but explicit fallback to 0 prevents any NaN risk in costVariance
    const safeEstimated = new Decimal(estimatedCost ?? 0);
    const safeActual = new Decimal(actualTaskCost ?? 0);
    const costVariance = safeEstimated.minus(safeActual);

    // Store costVariance as a plain number for Prisma Decimal field
    const costVarianceValue = costVariance.toNumber();

    const summary = await prisma.costSummary.upsert({
      where: { projectId },
      update: {
        estimatedCost,
        actualTaskCost,
        costVariance: costVarianceValue,
        lastUpdated: new Date(),
      },
      create: {
        projectId,
        estimatedCost,
        actualTaskCost,
        costVariance: costVarianceValue,
        lastUpdated: new Date(),
      },
    });

    return serializeCostSummary(summary);
  },
};
