import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  CreditCard,
  Clock,
  Check,
  ArrowLeft,
  Zap,
  Lock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Spinner from "@/components/ui/Spinner";
import useAuthStore from "@/store/useAuthStore";
import useTrainerDetailQuery from "@/hooks/useTrainerDetailQuery";
import { useCreateOrder, useVerifyPayment } from "@/hooks/useSubscriptionQuery";
import useToastStore from "@/store/useToastStore";
import { openRazorpayPayment } from "@/services/razorpayService";

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const trainerId = searchParams.get("trainer");
  const planId = searchParams.get("plan");

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const toast = useToastStore((s) => s.toast);

  const { data: trainer, isLoading: trainerLoading } = useTrainerDetailQuery(trainerId);
  const createOrderMutation = useCreateOrder();
  const verifyPaymentMutation = useVerifyPayment();

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect non-students
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/checkout?trainer=${trainerId}&plan=${planId}`);
    } else if (user?.role === "TRAINER") {
      navigate("/trainer/dashboard");
    }
  }, [isAuthenticated, user]);

  // Auto-select plan from URL param or first plan
  useEffect(() => {
    if (trainer?.plans?.length > 0) {
      if (planId) {
        const found = trainer.plans.find((p) => p.id === planId);
        setSelectedPlan(found || trainer.plans[0]);
      } else {
        setSelectedPlan(trainer.plans[0]);
      }
    }
  }, [trainer, planId]);

  const handlePay = async () => {
    if (!selectedPlan) return;
    setIsProcessing(true);

    try {
      // 1. Create order on backend
      const orderData = await createOrderMutation.mutateAsync(selectedPlan.id);

      // 2. Open Razorpay payment modal via service
      await openRazorpayPayment({
        orderData,
        planName: selectedPlan.name,
        trainerName: trainer?.user?.name || "Trainer",
        user,
        onSuccess: async (response) => {
          try {
            // 3. Verify payment on backend
            await verifyPaymentMutation.mutateAsync({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              subscriptionId: orderData.subscriptionId,
            });

            toast.success("🎉 Payment successful! Your subscription is now active.");
            navigate("/dashboard");
          } catch (err) {
            toast.error(err?.message || "Payment verification failed. Please contact support.");
            setIsProcessing(false);
          }
        },
        onDismiss: () => {
          setIsProcessing(false);
          toast.info("Payment cancelled.");
        },
        onError: (err) => {
          toast.error(err?.message || "Payment failed. Please try again.");
          setIsProcessing(false);
        },
      });
    } catch (err) {
      toast.error(err?.message || "Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  if (trainerLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-center px-4">
        <AlertCircle className="w-16 h-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Trainer not found</h1>
        <p className="text-muted-foreground">The trainer you're looking for doesn't exist.</p>
        <Link to="/trainers"><Button>Browse Trainers</Button></Link>
      </div>
    );
  }

  if (!trainer.plans || trainer.plans.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-center px-4">
        <AlertCircle className="w-16 h-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">No Plans Available</h1>
        <p className="text-muted-foreground">This trainer hasn't set up any subscription plans yet.</p>
        <Link to={`/trainer/${trainerId}`}><Button variant="outline">Go Back</Button></Link>
      </div>
    );
  }

  const trainerName = trainer.user?.name || "Trainer";
  const trainerAvatar = trainer.user?.avatar || "/user.jpg";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Back button */}
          <Link
            to={`/trainer/${trainerId}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* LEFT: Plan Selection */}
            <div className="lg:col-span-3 space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-1">Choose Your Plan</h1>
                <p className="text-muted-foreground">Select the plan that fits your goals.</p>
              </div>

              {/* Trainer Summary */}
              <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl">
                <img
                  src={trainerAvatar}
                  alt={trainerName}
                  className="w-14 h-14 rounded-xl object-cover border border-border"
                />
                <div>
                  <p className="font-bold text-lg">{trainerName}</p>
                  <p className="text-sm text-primary font-medium">{trainer.specialization}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {trainer.experience} yrs experience · {trainer.studentCount || 0}+ students
                  </p>
                </div>
              </div>

              {/* Plans */}
              <div className="space-y-3">
                {trainer.plans.map((plan) => {
                  const isSelected = selectedPlan?.id === plan.id;
                  return (
                    <motion.button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      whileTap={{ scale: 0.99 }}
                      className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div>
                            <p className="font-bold text-base">{plan.name}</p>
                            {plan.description && (
                              <p className="text-sm text-muted-foreground mt-0.5">{plan.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <p className="text-2xl font-bold">
                            ₹{Number(plan.price).toLocaleString("en-IN")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            for {plan.durationDays} days
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 pt-2">
                {[
                  { icon: ShieldCheck, label: "Secure Payment" },
                  { icon: Lock, label: "256-bit Encryption" },
                  { icon: Zap, label: "Instant Activation" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon className="w-4 h-4 text-primary" />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Order Summary */}
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <Card className="border-primary/20 shadow-xl shadow-primary/5">
                  <CardContent className="p-6 space-y-5">
                    <h2 className="text-lg font-bold">Order Summary</h2>

                    {selectedPlan ? (
                      <>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Plan</span>
                            <span className="font-medium">{selectedPlan.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Duration</span>
                            <span className="font-medium">
                              <Clock className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
                              {selectedPlan.durationDays} days
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Trainer</span>
                            <span className="font-medium">{trainerName}</span>
                          </div>
                        </div>

                        <div className="border-t border-border pt-4">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-base">Total</span>
                            <span className="text-2xl font-bold text-primary">
                              ₹{Number(selectedPlan.price).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>

                        <Button
                          onClick={handlePay}
                          disabled={isProcessing}
                          className="w-full h-12 text-base font-semibold gap-2"
                          id="razorpay-pay-btn"
                        >
                          {isProcessing ? (
                            <><Spinner size="sm" /><span>Processing...</span></>
                          ) : (
                            <><CreditCard className="w-5 h-5" /><span>Pay ₹{Number(selectedPlan.price).toLocaleString("en-IN")}</span></>
                          )}
                        </Button>

                        <p className="text-xs text-center text-muted-foreground">
                          By clicking Pay, you agree to our{" "}
                          <span className="text-primary cursor-pointer hover:underline">Terms of Service</span>.
                          Payments are processed securely via Razorpay.
                        </p>
                      </>
                    ) : (
                      <p className="text-muted-foreground text-sm text-center py-4">
                        Select a plan to proceed
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}