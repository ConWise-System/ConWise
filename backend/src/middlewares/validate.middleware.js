const validate = (schema, target = "body") => {
  return (req, res, next) => {
    const payload = req[target];

    if (!schema || typeof schema.parse !== "function") {
      return res.status(500).json({
        success: false,
        message: "Validation schema is not configured correctly.",
      });
    }

    const result = schema.safeParse(payload);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    req[target] = result.data;
    next();
  };
};

export default validate;
