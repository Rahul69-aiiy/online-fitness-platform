import prisma from "../config/db.js";
import ExpressError from "../utils/ExpressError.js";
import { createRazorpayOrder, verifyRazorpaySignature } from "../services/razorpayService.js";

// STUDENT: Create Razorpay order before payment
export const createOrder = async (req, res, next) => {
  try {
    const { planId } = req.body;
    const studentId = req.user.id;

    if (!planId) return next(new ExpressError("planId is required", 400));

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
      include: { trainer: { include: { user: true } } },
    });
    if (!plan) return next(new ExpressError("Plan not found", 404));

    // Check existing active subscription for this trainer
    const existingSub = await prisma.subscription.findUnique({
      where: { studentId_trainerId: { studentId, trainerId: plan.trainerId } },
    });

    if (existingSub && existingSub.isActive && new Date(existingSub.endDate) > new Date()) {
      return next(new ExpressError("You already have an active subscription with this trainer", 400));
    }

    // Amount in paise (Razorpay requires paise for INR)
    const amountInPaise = Math.round(parseFloat(plan.price) * 100);

    // Create Razorpay order via service
    const razorpayOrder = await createRazorpayOrder({
      amount: amountInPaise,
      receipt: `rcpt_${studentId.slice(0, 8)}_${Date.now()}`,
      notes: {
        planId,
        studentId,
        trainerId: plan.trainerId,
      },
    });

    // Calculate subscription dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationDays);

    // Create or update subscription (pending) + payment record in a transaction
    const [subscription, payment] = await prisma.$transaction(async (tx) => {
      let sub;
      if (existingSub) {
        // Resubscribe — update the existing record
        sub = await tx.subscription.update({
          where: { id: existingSub.id },
          data: {
            planId,
            startDate,
            endDate,
            isActive: false, // activated after payment verification
          },
        });
        // Remove old payment record so we can create a fresh one
        await tx.payment.deleteMany({ where: { subscriptionId: sub.id } });
      } else {
        sub = await tx.subscription.create({
          data: {
            studentId,
            trainerId: plan.trainerId,
            planId,
            startDate,
            endDate,
            isActive: false,
          },
        });
      }

      const pmt = await tx.payment.create({
        data: {
          studentId,
          subscriptionId: sub.id,
          amount: parseFloat(plan.price),
          gatewayOrderId: razorpayOrder.id,
          status: "PENDING",
        },
      });

      return [sub, pmt];
    });

    res.json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        subscriptionId: subscription.id,
        paymentId: payment.id,
        plan: {
          name: plan.name,
          description: plan.description,
          price: plan.price,
          durationDays: plan.durationDays,
        },
        trainer: {
          name: plan.trainer.user.name,
          avatar: plan.trainer.user.avatar,
        },
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

// STUDENT: Verify Razorpay payment and activate subscription
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, subscriptionId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !subscriptionId) {
      return next(new ExpressError("All payment fields are required", 400));
    }

    // Verify HMAC signature via service
    const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (!isValid) {
      await prisma.payment.updateMany({
        where: { gatewayOrderId: razorpay_order_id },
        data: { status: "FAILED" },
      });
      return next(new ExpressError("Payment verification failed. Invalid signature.", 400));
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { plan: true },
    });

    if (!subscription) return next(new ExpressError("Subscription not found", 404));

    // Activate subscription, update payment, increment trainer studentCount
    await prisma.$transaction([
      prisma.payment.updateMany({
        where: { gatewayOrderId: razorpay_order_id },
        data: {
          status: "SUCCESS",
          gatewayPaymentId: razorpay_payment_id,
        },
      }),
      prisma.subscription.update({
        where: { id: subscriptionId },
        data: { isActive: true },
      }),
      prisma.trainerProfile.update({
        where: { id: subscription.trainerId },
        data: { studentCount: { increment: 1 } },
      }),
    ]);

    res.json({ success: true, message: "Payment verified and subscription activated!" });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};

// STUDENT: Full payment history
export const getPaymentHistory = async (req, res, next) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { studentId: req.user.id },
      include: {
        subscription: {
          include: {
            plan: true,
            trainer: { include: { user: { omit: { password: true } } } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: payments });
  } catch (error) {
    console.error("Get payment history error:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    });
  }
};
