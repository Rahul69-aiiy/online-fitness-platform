import prisma from "../config/db.js";
import ExpressError from "../utils/ExpressError.js";
import { createRazorpayOrder, verifyRazorpaySignature } from "../services/razorpayService.js";

// TRAINER: Plan Management 

// CREATE
export const createPlan = async (req, res, next) => {
  try {
    const { name, description, price, durationDays } = req.body;

    if (!name || !price || !durationDays) {
      return next(new ExpressError("name, price and durationDays are required", 400));
    }

    const trainerProfile = req.user.trainerProfile;
    if (!trainerProfile) {
      return next(new ExpressError("Trainer profile not found", 404));
    }

    const plan = await prisma.subscriptionPlan.create({
      data: {
        trainerId: trainerProfile.id,
        name,
        description: description || null,
        price: parseFloat(price),
        durationDays: parseInt(durationDays),
      },
    });

    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    console.error("Create plan error:", error);
    next(error);
  }
};

// Update
export const updatePlan = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const { name, description, price, durationDays } = req.body;

    const existing = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });
    if (!existing) return next(new ExpressError("Plan not found", 404));
    if (existing.trainerId !== req.user.trainerProfile?.id) {
      return next(new ExpressError("Forbidden", 403));
    }

    const plan = await prisma.subscriptionPlan.update({
      where: { id: planId },
      data: {
        name: name || undefined,
        description: description !== undefined ? description : undefined,
        price: price ? parseFloat(price) : undefined,
        durationDays: durationDays ? parseInt(durationDays) : undefined,
      },
    });

    res.json({ success: true, data: plan });
  } catch (error) {
    console.error("Update plan error:", error);
    next(error);
  }
};

// DELETE 
export const deletePlan = async (req, res, next) => {
  try {
    const { planId } = req.params;

    const existing = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });
    if (!existing) return next(new ExpressError("Plan not found", 404));
    if (existing.trainerId !== req.user.trainerProfile?.id) {
      return next(new ExpressError("Forbidden", 403));
    }

    await prisma.subscriptionPlan.delete({ where: { id: planId } });
    res.json({ success: true, message: "Plan deleted" });
  } catch (error) {
    console.error("Delete plan error:", error);
    next(error);
  }
};

// GET 
export const getMyPlans = async (req, res, next) => {
  try {
    const trainerProfile = req.user.trainerProfile;
    if (!trainerProfile) return next(new ExpressError("Trainer profile not found", 404));

    const plans = await prisma.subscriptionPlan.findMany({
      where: { trainerId: trainerProfile.id },
      orderBy: { createdAt: "asc" },
    });

    res.json({ success: true, data: plans });
  } catch (error) {
    console.error("Get my plans error:", error);
    next(error);
  }
};

// STUDENT: Checkout

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

    // Create Razorpay order using service
    const razorpayOrder = await createRazorpayOrder({
      amount: amountInPaise,
      receipt: `rcpt_${studentId.slice(0, 8)}_${Date.now()}`,
      notes: {
        planId,
        studentId,
        trainerId: plan.trainerId,
      },
    });

    // Calculate subscription end date
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationDays);

    // Create or update subscription (pending) + payment record in a transaction
    const [subscription, payment] = await prisma.$transaction(async (tx) => {
      let sub;
      if (existingSub) {
        // Resubscribe — update the existing one
        sub = await tx.subscription.update({
          where: { id: existingSub.id },
          data: {
            planId,
            startDate,
            endDate,
            isActive: false, // will be activated after payment verification
          },
        });
        // Delete old payment if it exists
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
    next(error);
  }
};

// VERIFY PAYMENT
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, subscriptionId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !subscriptionId) {
      return next(new ExpressError("All payment fields are required", 400));
    }

    // Verify HMAC signature using service
    const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (!isValid) {
      // Mark payment as failed
      await prisma.payment.updateMany({
        where: { gatewayOrderId: razorpay_order_id },
        data: { status: "FAILED" },
      });
      return next(new ExpressError("Payment verification failed. Invalid signature.", 400));
    }

    // Activate subscription and update payment in a transaction
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { plan: true },
    });

    if (!subscription) return next(new ExpressError("Subscription not found", 404));

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
      // Increment trainer's student count
      prisma.trainerProfile.update({
        where: { id: subscription.trainerId },
        data: { studentCount: { increment: 1 } },
      }),
    ]);

    res.json({ success: true, message: "Payment verified and subscription activated!" });
  } catch (error) {
    console.error("Verify payment error:", error);
    next(error);
  }
};

// STUDENT: Subscriptions 

// GET SUBSCRIPTIONS
export const getMySubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { studentId: req.user.id },
      include: {
        plan: true,
        trainer: {
          include: { user: { omit: { password: true } } },
        },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: subscriptions });
  } catch (error) {
    console.error("Get subscriptions error:", error);
    next(error);
  }
};

// CANCEL SUBSCRIPTION
export const cancelSubscription = async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) return next(new ExpressError("Subscription not found", 404));
    if (subscription.studentId !== req.user.id) return next(new ExpressError("Forbidden", 403));

    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { isActive: false },
    });

    res.json({ success: true, message: "Subscription cancelled" });
  } catch (error) {
    console.error("Cancel subscription error:", error);
    next(error);
  }
};

// GET PAYMENT HISTORY
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
    next(error);
  }
};

// TRAINER: Subscribers

// GET SUBSCRIBERS
export const getMySubscribers = async (req, res, next) => {
  try {
    const trainerProfile = req.user.trainerProfile;
    if (!trainerProfile) return next(new ExpressError("Trainer profile not found", 404));

    const subscriptions = await prisma.subscription.findMany({
      where: { trainerId: trainerProfile.id },
      include: {
        student: { omit: { password: true } },
        plan: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: subscriptions });
  } catch (error) {
    console.error("Get subscribers error:", error);
    next(error);
  }
};
