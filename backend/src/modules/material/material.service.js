import { PrismaClient } from "../../generated/prisma/index.js";
import { ROLES } from "../../config/constants.js";

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

// ─── MaterialUsed service ─────────────────────────────────────────────────────
export const materialService = {
  // Create a new material record
  createMaterial: async (data) => {
    const material = await prisma.materialUsed.create({
      data: {
        materialName: data.materialName,
        quantityUsed: data.quantityUsed,
        unit: data.unit,
        usageDescription: data.usageDescription ?? null,
        materialStatus: data.materialStatus,
      },
    });
    return serializeMaterial(material);
  },

  // List all materials
  // All roles can view materials
  getAllMaterials: async () => {
    const materials = await prisma.materialUsed.findMany({
      orderBy: { id: "desc" },
    });
    return materials.map(serializeMaterial);
  },

  // Get a single material by ID
  getMaterialById: async (materialId) => {
    const material = await prisma.materialUsed.findUnique({
      where: { id: materialId },
      include: {
        // Show which tasks this material is linked to
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
  // COMPANY_ADMIN and PROJECT_MANAGER can update any material
  // SITE_ENGINEER can update materials linked to their assigned tasks
  updateMaterial: async ({
    materialId,
    updateData,
    userId,
    role,
    companyId,
  }) => {
    // First confirm the material exists
    const existing = await prisma.materialUsed.findUnique({
      where: { id: materialId },
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

    const updated = await prisma.materialUsed.update({
      where: { id: materialId },
      data: updateData,
    });

    return serializeMaterial(updated);
  },

  // Delete a material
  // COMPANY_ADMIN: can delete any material
  // PROJECT_MANAGER: can delete materials not linked to any task
  deleteMaterial: async ({ materialId, role }) => {
    const existing = await prisma.materialUsed.findUnique({
      where: { id: materialId },
      include: { tasks: { select: { id: true } } },
    });

    if (!existing) return null;

    // Whitelist: only COMPANY_ADMIN and PROJECT_MANAGER can delete
    if (role === ROLES.COMPANY_ADMIN) {
      // Can delete any material — no additional check
    } else if (role === ROLES.PROJECT_MANAGER) {
      // Block deletion if the material is still linked to active tasks
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
    // Verify the project belongs to this company
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
  // costVariance is always computed here: estimatedCost - actualTaskCost
  // Never accepted from the client — prevents manipulation
  upsertCostSummary: async ({
    projectId,
    companyId,
    estimatedCost,
    actualTaskCost,
  }) => {
    // Verify the project belongs to this company
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

    // costVariance computed server-side — never from client
    const costVariance = parseFloat(estimatedCost) - parseFloat(actualTaskCost);

    const summary = await prisma.costSummary.upsert({
      where: { projectId },
      update: {
        estimatedCost,
        actualTaskCost,
        costVariance,
        lastUpdated: new Date(),
      },
      create: {
        projectId,
        estimatedCost,
        actualTaskCost,
        costVariance,
      },
    });

    return serializeCostSummary(summary);
  },
};
