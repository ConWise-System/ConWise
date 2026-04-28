// src/modules/issue/issue.validation.js
import { z } from "zod";

// ─── Shared middleware ────────────────────────────────────────────────────────
export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: result.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }
  req.body = result.data;
  next();
};

// ─── Enums (mirror Prisma enums) ──────────────────────────────────────────────
const ISSUE_STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const PRIORITY_LEVELS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

// ─── Create Issue ─────────────────────────────────────────────────────────────
export const createIssueSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must not exceed 2000 characters"),

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"], {
      errorMap: (issue) => ({
        message:
          issue.code === "invalid_enum_value"
            ? `Priority must be one of: ${PRIORITY_LEVELS.join(", ")}`
            : "Priority is required",
      }),
    })
    .default("MEDIUM"),

  location: z
    .string()
    .max(200, "Location must not exceed 200 characters")
    .optional(),

  photoUrls: z
    .array(z.string().url("Each photo must be a valid URL"))
    .max(10, "Maximum 10 photos allowed")
    .default([]),

  blockedTaskId: z
    .number({ invalid_type_error: "blockedTaskId must be a number" })
    .int()
    .positive()
    .optional(),
});

// ─── Update Issue (editable fields only) ─────────────────────────────────────
export const updateIssueSchema = z
  .object({
    title: z.string().min(3).max(200).optional(),
    description: z.string().min(10).max(2000).optional(),
    location: z.string().max(200).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
    photoUrls: z
      .array(z.string().url("Each photo must be a valid URL"))
      .max(10)
      .optional(),
    blockedTaskId: z.number().int().positive().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

// ─── Assign Issue ─────────────────────────────────────────────────────────────
export const assignIssueSchema = z.object({
  assigneeId: z
    .number({ required_error: "assigneeId is required" })
    .int("assigneeId must be an integer")
    .positive("assigneeId must be a positive number"),

  note: z.string().max(500, "Note must not exceed 500 characters").optional(),
});

// ─── Update Status ────────────────────────────────────────────────────────────
export const updateStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"], {
    errorMap: (issue) => ({
      message:
        issue.code === "invalid_enum_value"
          ? `Status must be one of: ${ISSUE_STATUSES.join(", ")}`
          : "status is required",
    }),
  }),

  note: z.string().max(500, "Note must not exceed 500 characters").optional(),
});
