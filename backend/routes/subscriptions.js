import { Router } from "express";
import { isAuthenticated, authorizeRoles } from "../middlewares/middleware.js";
import {
  createPlan,
  updatePlan,
  deletePlan,
  getMyPlans,
  createOrder,
  verifyPayment,
  getMySubscriptions,
  cancelSubscription,
  getPaymentHistory,
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

// STUDENT: Checkout 
router.post("/order", isAuthenticated, authorizeRoles("STUDENT"), createOrder);
router.post("/verify", isAuthenticated, authorizeRoles("STUDENT"), verifyPayment);

// STUDENT: Subscriptions and Payments 
router.get("/my", isAuthenticated, authorizeRoles("STUDENT"), getMySubscriptions);
router.get("/payments", isAuthenticated, authorizeRoles("STUDENT"), getPaymentHistory);
router.delete("/:subscriptionId", isAuthenticated, authorizeRoles("STUDENT"), cancelSubscription);

export default router;
