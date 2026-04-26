import { z } from "zod";

// ─── Shared middleware ────────────────────────────────────────────────────────
// FIX(CodeRabbit): Include field paths in validation error responses
// Each error now returns { field, message } so the client knows exactly
// which field failed — not just the message text
export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: result.error.errors.map((e) => ({
        field: e.path.join(".") || "unknown",
        message: e.message,
      })),
    });
  }
  req.body = result.data;
  next();
};

// ─── MaterialUsed schemas ─────────────────────────────────────────────────────

export const createMaterialSchema = z.object({
  materialName: z
    .string()
    .min(2, "Material name must be at least 2 characters")
    .max(100, "Material name must not exceed 100 characters"),

  quantityUsed: z
    .number({ required_error: "Quantity is required" })
    .positive("Quantity must be a positive number"),

  unit: z
    .string()
    .min(1, "Unit is required")
    .max(30, "Unit must not exceed 30 characters"),

  usageDescription: z
    .string()
    .max(500, "Usage description must not exceed 500 characters")
    .optional(),

  materialStatus: z
    .string()
    .min(1, "Material status is required")
    .max(50, "Material status must not exceed 50 characters"),
});

export const updateMaterialSchema = z
  .object({
    materialName: z.string().min(2).max(100).optional(),
    quantityUsed: z.number().positive().optional(),
    unit: z.string().min(1).max(30).optional(),
    usageDescription: z.string().max(500).optional(),
    materialStatus: z.string().min(1).max(50).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

// ─── CostSummary schemas ──────────────────────────────────────────────────────

export const upsertCostSummarySchema = z.object({
  estimatedCost: z
    .number({ required_error: "Estimated cost is required" })
    .nonnegative("Estimated cost must be zero or positive"),

  actualTaskCost: z
    .number({ required_error: "Actual task cost is required" })
    .nonnegative("Actual task cost must be zero or positive"),
});

// costVariance is always computed server-side: estimatedCost - actualTaskCost
// It is never accepted from the client
