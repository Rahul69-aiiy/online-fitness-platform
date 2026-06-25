import razorpay from "../config/razorpay.js";
import crypto from "crypto";

export const createRazorpayOrder = async ({ amount, receipt, notes }) => {
  return await razorpay.orders.create({
    amount,
    currency: "INR",
    receipt,
    notes,
  });
};

export const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");
  return expectedSignature === signature;
};
