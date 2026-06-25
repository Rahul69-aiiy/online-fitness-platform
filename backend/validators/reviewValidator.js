import { z } from "zod";
import { validateRequest } from "./zodValidator.js";

const createReviewSchema = z.object({
  trainerId: z
    .string({ required_error: "Trainer ID is required." })
    .min(1, "Trainer ID is required."),
  rating: z.coerce
    .number({ required_error: "Rating is required." })
    .int("Rating must be an integer.")
    .min(1, "Rating must be at least 1.")
    .max(5, "Rating cannot exceed 5."),
  comment: z
    .string({ required_error: "Comment is required." })
    .min(3, "Comment must be at least 3 characters.")
    .max(500, "Comment cannot exceed 500 characters."),
});

const updateReviewSchema = z.object({
  rating: z.coerce
    .number()
    .int("Rating must be an integer.")
    .min(1, "Rating must be at least 1.")
    .max(5, "Rating cannot exceed 5.")
    .optional(),
  comment: z
    .string()
    .min(3, "Comment must be at least 3 characters.")
    .max(500, "Comment cannot exceed 500 characters.")
    .optional(),
});

export const validateCreateReview = validateRequest(createReviewSchema);
export const validateUpdateReview = validateRequest(updateReviewSchema);
