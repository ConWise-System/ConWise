import { z } from "zod";

const ProjectStatus = z.enum([
  "PLANNING",
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
  "CANCELLED",
]);

export const createProjectSchema = z
  .object({
    projectName: z
      .string({ required_error: "Project name is required." })
      .min(2, "Project name must be at least 2 characters.")
      .max(100, "Project name must not exceed 100 characters."),

    location: z
      .string({ required_error: "Location is required." })
      .min(2, "Location must be at least 2 characters.")
      .max(100, "Location must not exceed 100 characters."),

    startDate: z.coerce
      .date({ required_error: "Start date is required." })
      .refine(
        (d) => {
          const today = new Date();
          today.setUTCHours(0, 0, 0, 0);
          const inputDate = new Date(d);
          inputDate.setUTCHours(0, 0, 0, 0);
          return inputDate >= today;
        },
        {
          message: "Start date cannot be in the past.",
        },
      ),
    endDate: z.coerce.date().optional(),

    clientName: z
      .string({ required_error: "Client name is required." })
      .min(2, "Client name must be at least 2 characters.")
      .max(100, "Client name must not exceed 100 characters."),

    projectBudget: z
      .number({ required_error: "Project budget is required." })
      .positive("Project budget must be a positive number."),

    status: ProjectStatus.default("PLANNING"),
  })
  .refine(
    (data) => {
      if (data.endDate && data.startDate) {
        return data.endDate > data.startDate;
      }
      return true;
    },
    {
      message: "End date must be after start date.",
      path: ["endDate"],
    },
  );

export const updateProjectSchema = z
  .object({
    projectName: z.string().min(2).max(100).optional(),
    location: z.string().min(2).max(100).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    clientName: z.string().min(2).max(100).optional(),
    projectBudget: z.number().positive().optional(),
    status: z
      .enum(["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"])
      .optional(),
  })
  .refine(
    (data) => {
      // Only validate ordering if BOTH dates are provided together
      if (data.startDate && data.endDate) {
        return data.endDate > data.startDate;
      }
      return true;
    },
    {
      message: "endDate must be after startDate",
      path: ["endDate"],
    },
  );

// Reusable validate middleware
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

  // Attach cleaned and coerced data back to req.body
  req.body = result.data;
  next();
};
