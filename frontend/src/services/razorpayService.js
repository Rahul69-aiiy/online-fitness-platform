/**
 * Load the Razorpay SDK script dynamically
 * @returns {Promise<boolean>} Resolves to true when the script loads successfully
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });
};

/**
 * Open the Razorpay checkout modal
 * @param {Object} params
 * @param {Object} params.orderData - Order data returned from backend (/api/subscriptions/order)
 * @param {string} params.planName - Name of the selected subscription plan
 * @param {string} params.trainerName - Name of the trainer
 * @param {Object} params.user - The currently authenticated user object
 * @param {Function} params.onSuccess - Callback on payment success
 * @param {Function} params.onDismiss - Callback on payment modal dismiss/cancellation
 * @param {Function} params.onError - Callback on payment failure or error
 */
export const openRazorpayPayment = async ({
  orderData,
  planName,
  trainerName,
  user,
  onSuccess,
  onDismiss,
  onError,
}) => {
  try {
    await loadRazorpayScript();

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "PhysiQ Fitness",
      description: `${planName} — ${trainerName}`,
      order_id: orderData.orderId,
      image: "/favicon.svg",
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
      },
      theme: {
        color: "#6366f1",
      },
      handler: async (response) => {
        onSuccess(response);
      },
      modal: {
        ondismiss: () => {
          onDismiss();
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response) => {
      onError(new Error(response.error.description || "Payment failed"));
    });
    rzp.open();
  } catch (error) {
    onError(error);
  }
};
