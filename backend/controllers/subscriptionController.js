import prisma from "../config/db.js";
import ExpressError from "../utils/ExpressError.js";

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
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later."
    });
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
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later."
    });
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
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later."
    });
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
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later."
    });
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
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later."
    });
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
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later."
    });
  }
};
