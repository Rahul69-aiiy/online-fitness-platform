import { Router } from "express";
import { isAuthenticated, authorizeRoles } from "../middlewares/middleware.js";
import { createOrder, verifyPayment, getPaymentHistory } from "../controllers/paymentController.js";

const router = Router();

// STUDENT: Initiate a Razorpay order for a plan
router.post("/order", isAuthenticated, authorizeRoles("STUDENT"), createOrder);

// STUDENT: Verify payment and activate subscription
router.post("/verify", isAuthenticated, authorizeRoles("STUDENT"), verifyPayment);

// STUDENT: Full payment history
router.get("/history", isAuthenticated, authorizeRoles("STUDENT"), getPaymentHistory);

export default router;
