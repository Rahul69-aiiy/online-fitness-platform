import { Router } from "express";
import ExpressError from "../utils/ExpressError.js"
import authRoutes from "./auth.js"
import userRoutes from "./users.js"
import trainerRoutes from "./trainers.js"
import reviewRoutes from "./reviews.js"
import messageRoutes from "./messages.js"
import subscriptionRoutes from "./subscriptions.js"
import paymentRoutes from "./payments.js"

const router = Router()

router.get("/api/status", (req, res) => res.send("Server is live"))

router.use("/api/auth", authRoutes);
router.use('/api/users', userRoutes);
router.use('/api/trainers', trainerRoutes);
router.use('/api/reviews', reviewRoutes);
router.use('/api/messages', messageRoutes);
router.use('/api/subscriptions', subscriptionRoutes);
router.use('/api/payments', paymentRoutes);

// Invalid routes
router.use((req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

export default router