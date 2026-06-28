import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, CreditCard, Users, Clock, XCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import { useMySubscriptions, useCancelSubscription } from "@/hooks/useSubscriptionQuery";
import Spinner from "@/components/ui/Spinner";
import useToastStore from "@/store/useToastStore";

function formatExpiry(dateStr) {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = date - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Expires today";
    if (diffDays === 1) return "Expires tomorrow";
    if (diffDays <= 7) return `Expires in ${diffDays} days`;

    return `Expires ${date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;
  } catch {
    return "";
  }
}

export default function StudentDashboard() {
  const user = useAuthStore((s) => s.user);
  const toast = useToastStore((s) => s.toast);
  const { data: subscriptions = [], isLoading } = useMySubscriptions();
  const cancelMutation = useCancelSubscription();

  const activeSubscriptions = subscriptions.filter(
    (s) => s.isActive && new Date(s.endDate) > new Date()
  );
  const expiredSubscriptions = subscriptions.filter(
    (s) => !s.isActive || new Date(s.endDate) <= new Date()
  );

  const handleCancel = async (subId) => {
    if (!confirm("Are you sure you want to cancel this subscription?")) return;
    try {
      await cancelMutation.mutateAsync(subId);
      toast.success("Subscription cancelled.");
    } catch (err) {
      toast.error(err?.message || "Failed to cancel subscription");
    }
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name?.split(" ")[0] || "there"}! 
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your fitness journey.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                <h3 className="text-2xl font-bold">{isLoading ? "—" : activeSubscriptions.length}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Subscriptions</p>
                <h3 className="text-2xl font-bold">{isLoading ? "—" : subscriptions.length}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expired</p>
                <h3 className="text-2xl font-bold">{isLoading ? "—" : expiredSubscriptions.length}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Subscriptions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Active Subscriptions</h2>
              <Link to="/trainers">
                <Button variant="link" className="text-primary p-0 h-auto gap-1 text-sm">
                  Discover More <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : activeSubscriptions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center py-12 text-center">
                  <Users className="w-12 h-12 text-muted-foreground mb-3 opacity-30" />
                  <p className="font-medium mb-1">No active subscriptions</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Find a trainer and start your fitness journey!
                  </p>
                  <Link to="/trainers">
                    <Button size="sm">Browse Trainers</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeSubscriptions.map((sub) => {
                  const trainer = sub.trainer;
                  const trainerName = trainer?.user?.name || "Trainer";
                  const trainerAvatar = trainer?.user?.avatar || "/user.jpg";
                  const plan = sub.plan;

                  return (
                    <Card key={sub.id} className="hover:border-primary/30 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-border shrink-0">
                            <img
                              src={trainerAvatar}
                              alt={trainerName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm">{trainerName}</h4>
                            <p className="text-xs text-primary font-medium">
                              {trainer?.specialization || "Fitness Trainer"}
                            </p>
                            {plan && (
                              <p className="text-xs text-muted-foreground mt-0.5">{plan.name}</p>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <span className="inline-flex items-center gap-1 text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full font-medium">
                              <CheckCircle2 className="w-3 h-3" />
                              Active
                            </span>
                          </div>
                        </div>
                        <p className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatExpiry(sub.endDate)}
                        </p>
                        <div className="flex gap-2">
                          <Link to={`/trainer/${trainer?.id}`} className="flex-1">
                            <Button size="sm" className="w-full" variant="secondary">
                              View Profile
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancel(sub.id)}
                            disabled={cancelMutation.isPending}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Expired subscriptions (if any) */}
            {expiredSubscriptions.length > 0 && !isLoading && (
              <div>
                <h3 className="text-base font-semibold text-muted-foreground mb-3">Expired / Cancelled</h3>
                <div className="space-y-3">
                  {expiredSubscriptions.map((sub) => {
                    const trainer = sub.trainer;
                    const trainerName = trainer?.user?.name || "Trainer";
                    const trainerAvatar = trainer?.user?.avatar || "/user.jpg";

                    return (
                      <Card key={sub.id} className="opacity-60">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={trainerAvatar}
                              alt={trainerName}
                              className="w-10 h-10 rounded-xl object-cover border border-border"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{trainerName}</p>
                              <p className="text-xs text-muted-foreground">{sub.plan?.name}</p>
                            </div>
                            <Link to={`/checkout?trainer=${trainer?.id}&plan=${sub.plan?.id}`}>
                              <Button size="sm" variant="outline" className="text-xs">
                                Renew
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Quick Links</h2>
            <div className="space-y-3">
              <Link to="/trainers">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  Find a Trainer
                </Button>
              </Link>
              <Link to="/messages">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Message Trainer
                </Button>
              </Link>
              <Link to="/payment-history">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  Payment History
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Update Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
