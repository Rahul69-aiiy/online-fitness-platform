import { z } from "zod";
import { validateRequest } from "./zodValidator.js";

const studentRegisterSchema = z.object({
  name: z
    .string({ required_error: "Name is required." })
    .min(2, "Name must be at least 2 characters."),
  email: z
    .string({ required_error: "Email is required." })
    .email("Please provide a valid email address."),
  password: z
    .string({ required_error: "Password is required." })
    .min(6, "Password must be at least 6 characters."),
});

const trainerRegisterSchema = studentRegisterSchema.extend({
  specialization: z.string({ required_error: "Specialization is required." }).min(2, "Specialization is required."),
  experience: z.number().int().min(0).default(0).optional(),
  bio: z.string({ required_error: "Bio is required." }).min(10, "Bio is required."),
  primaryLocation: z.string({ required_error: "Primary Location is required." }).min(2, "Location is required."),
  certifications: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email("Please provide a valid email address."),
  password: z
    .string({ required_error: "Password is required." })
    .min(6, "Password must be at least 6 characters."),
});

export const validateRegister = (req, res, next) => {
  const { role } = req.params;
  if (role === "student") {
    return validateRequest(studentRegisterSchema)(req, res, next);
  } else if (role === "trainer") {
    return validateRequest(trainerRegisterSchema)(req, res, next);
  }
  return res.status(400).json({ success: false, message: "Invalid role specified." });
};

export const validateLogin = validateRequest(loginSchema);