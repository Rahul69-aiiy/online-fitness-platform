export const validateRequest = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      // Map all zod errors to a single clean readable sentence string
      const errorMessage = result.error.errors
        .map((err) => err.message)
        .join(" ");

      return res.status(400).json({
        success: false,
        message: errorMessage || "Validation error.",
      });
    }

    // Assign sanitized and validated output back to request body
    req.body = result.data;
    next();
  };
};
