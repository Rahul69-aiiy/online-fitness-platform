import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SESSIONS } from "@/mocks/mockData";
import { Calendar, Clock, Users } from "lucide-react";

export default function TrainerDashboard() {
  const upcomingSessions = SESSIONS.filter((s) => s.trainerId === "1");

  return (
    <DashboardLayout role="trainer">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Trainer Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your sessions and subscribers.
            </p>
          </div>
          <Button className="gap-2">
            <Calendar className="w-4 h-4" />
            Create New Session
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">
                Active Subscribers
              </p>
              <h3 className="text-2xl font-bold">120</h3>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">
                Upcoming Sessions
              </p>
              <h3 className="text-2xl font-bold">5</h3>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">
                Pending Bookings
              </p>
              <h3 className="text-2xl font-bold">12</h3>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Avg. Rating</p>
              <h3 className="text-2xl font-bold">4.9</h3>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Sessions */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold">Upcoming Sessions</h2>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <Card
                  key={session.id}
                  className="overflow-hidden border-border"
                >
                  <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-border shrink-0">
                        <img
                          src={session.image}
                          alt={session.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm mb-1">
                          {session.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-[10px] text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{session.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{session.time}</span>
                          </div>
                          <div className="flex items-center gap-1 text-primary">
                            <Users className="w-3 h-3" />
                            <span>
                              {session.bookedCount}/{session.capacity} Booked
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm">Manage</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <Card>
              <CardContent className="p-6 space-y-6">
                {[
                  {
                    user: "Sarah J.",
                    action: "subscribed to your Annual Plan",
                    time: "2 hours ago",
                  },
                  {
                    user: "Mike R.",
                    action: "booked 'Morning Power Lift'",
                    time: "4 hours ago",
                  },
                  {
                    user: "Elena P.",
                    action: "left a 5-star review",
                    time: "Yesterday",
                  },
                  {
                    user: "David K.",
                    action: "canceled booking for 'Yoga Flow'",
                    time: "Yesterday",
                  },
                ].map((activity, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <div>
                      <p className="text-foreground">
                        <span className="font-bold">{activity.user}</span>{" "}
                        {activity.action}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
