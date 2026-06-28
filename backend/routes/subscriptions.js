import { Router } from "express";
import { isAuthenticated, authorizeRoles } from "../middlewares/middleware.js";
import {
  createPlan,
  updatePlan,
  deletePlan,
  getMyPlans,
  getMySubscriptions,
  getMySubscribers,
} from "../controllers/subscriptionController.js";

const router = Router();

// TRAINER: Plan Management 
router.post("/plans", isAuthenticated, authorizeRoles("TRAINER"), createPlan);
router.put("/plans/:planId", isAuthenticated, authorizeRoles("TRAINER"), updatePlan);
router.delete("/plans/:planId", isAuthenticated, authorizeRoles("TRAINER"), deletePlan);
router.get("/plans/my", isAuthenticated, authorizeRoles("TRAINER"), getMyPlans);

// TRAINER: Subscribers
router.get("/subscribers", isAuthenticated, authorizeRoles("TRAINER"), getMySubscribers);

// STUDENT: Active subscription list 
router.get("/my", isAuthenticated, authorizeRoles("STUDENT"), getMySubscriptions);

export default router;
