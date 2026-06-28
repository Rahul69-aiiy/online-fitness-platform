import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, PackagePlus, MessageSquare, Star, TrendingUp, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";
import { useMySubscribers, useMyPlans } from "@/hooks/useSubscriptionQuery";
import Spinner from "@/components/ui/Spinner";

function timeAgo(dateStr) {
  try {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  } catch {
    return "";
  }
}

export default function TrainerDashboard() {
  const user = useAuthStore((s) => s.user);
  const { data: subscribers = [], isLoading: subLoading } = useMySubscribers();
  const { data: plans = [], isLoading: plansLoading } = useMyPlans();

  const activeSubscribers = subscribers.filter(
    (s) => s.isActive && new Date(s.endDate) > new Date()
  );
  const totalRevenue = subscribers
    .filter((s) => s.payment?.status === "SUCCESS")
    .reduce((sum, s) => sum + Number(s.payment?.amount || 0), 0);

  const avgRating = user?.trainerProfile?.rating || 0;

  return (
    <DashboardLayout role="trainer">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {user?.name?.split(" ")[0] || "Coach"}! 
            </h1>
            <p className="text-muted-foreground">
              Manage your subscribers and grow your fitness community.
            </p>
          </div>
          <Link to="/trainer/manage-plans">
            <Button className="gap-2" id="manage-plans-btn">
              <PackagePlus className="w-4 h-4" />
              Manage Plans
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Subscribers</p>
                <h3 className="text-2xl font-bold">
                  {subLoading ? "—" : activeSubscribers.length}
                </h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl font-bold">
                  {subLoading ? "—" : `₹${totalRevenue.toLocaleString("en-IN")}`}
                </h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Rating</p>
                <h3 className="text-2xl font-bold">{avgRating ? avgRating.toFixed(1) : "—"}</h3>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <PackagePlus className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Plans</p>
                <h3 className="text-2xl font-bold">{plansLoading ? "—" : plans.length}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Subscribers */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Recent Subscribers</h2>
            </div>
            <Card>
              <CardContent className="p-0">
                {subLoading ? (
                  <div className="flex justify-center py-12">
                    <Spinner size="lg" />
                  </div>
                ) : subscribers.length === 0 ? (
                  <div className="flex flex-col items-center py-16 text-center px-4">
                    <Users className="w-12 h-12 text-muted-foreground mb-3 opacity-30" />
                    <p className="font-medium mb-1">No subscribers yet</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Set up your subscription plans to start attracting students.
                    </p>
                    <Link to="/trainer/manage-plans">
                      <Button size="sm" className="gap-2">
                        <PackagePlus className="w-4 h-4" />
                        Create a Plan
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {subscribers.slice(0, 8).map((sub) => {
                      const student = sub.student;
                      const studentName = student?.name || "Student";
                      const studentAvatar = student?.avatar || "/user.jpg";
                      const isActive = sub.isActive && new Date(sub.endDate) > new Date();

                      return (
                        <div key={sub.id} className="flex items-center gap-4 p-4">
                          <img
                            src={studentAvatar}
                            alt={studentName}
                            className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{studentName}</p>
                            <p className="text-xs text-muted-foreground">
                              {sub.plan?.name || "Plan"}
                            </p>
                          </div>
                          <div className="text-right shrink-0 space-y-1">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                isActive
                                  ? "bg-green-500/10 text-green-500"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {isActive ? "Active" : "Expired"}
                            </span>
                            <p className="text-xs text-muted-foreground">
                              {timeAgo(sub.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/trainer/manage-plans">
                <Button className="w-full gap-2 justify-start" variant="outline">
                  <PackagePlus className="w-4 h-4" />
                  Manage Plans
                </Button>
              </Link>
              <Link to="/trainer/messages">
                <Button className="w-full gap-2 justify-start" variant="outline">
                  <MessageSquare className="w-4 h-4" />
                  Message Students
                </Button>
              </Link>
              <Link to="/settings">
                <Button className="w-full gap-2 justify-start" variant="outline">
                  <Star className="w-4 h-4" />
                  Update Profile
                </Button>
              </Link>
            </div>

            {/* Plans summary */}
            {plans.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">Your Plans</h3>
                  <Link to="/trainer/manage-plans">
                    <Button variant="link" className="text-xs p-0 h-auto gap-1">
                      Edit <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-2">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className="flex justify-between items-center p-3 bg-card border border-border rounded-xl text-sm"
                    >
                      <div>
                        <p className="font-medium">{plan.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />{plan.durationDays} days
                        </p>
                      </div>
                      <p className="font-bold text-primary">
                        ₹{Number(plan.price).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
