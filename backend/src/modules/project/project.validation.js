import Joi from "joi";

export const createProjectSchema = Joi.object({
  projectName: Joi.string().min(2).max(100).required(),
  location: Joi.string().min(2).max(100).required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().greater(Joi.ref("startDate")).optional(),
  clientName: Joi.string().min(2).max(100).required(),
  projectBudget: Joi.number().positive().required(),
  status: Joi.string()
    .valid("PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED")
    .optional(),
});

export const updateProjectSchema = Joi.object({
  projectName: Joi.string().min(2).max(100).optional(),
  location: Joi.string().min(2).max(100).optional(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  clientName: Joi.string().min(2).max(100).optional(),
  projectBudget: Joi.number().positive().optional(),
  status: Joi.string()
    .valid("PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED")
    .optional(),
});

export const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.details.map((d) => d.message),
    });
  }
  next();
};
