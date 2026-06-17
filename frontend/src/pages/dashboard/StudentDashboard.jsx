import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SESSIONS, TRAINERS } from "@/mocks/mockData";
import { Calendar, Clock, MapPin, Play, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const upcomingSessions = SESSIONS.slice(0, 2);
  const activeSubscriptions = TRAINERS.slice(0, 1);

  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, John!</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your fitness journey.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">
                Upcoming Sessions
              </p>
              <h3 className="text-2xl font-bold">3</h3>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">
                Active Subscriptions
              </p>
              <h3 className="text-2xl font-bold">1</h3>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">
                Completed Hours
              </p>
              <h3 className="text-2xl font-bold">12.5</h3>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Sessions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Upcoming Sessions</h2>
              <Button variant="link" className="text-primary p-0 h-auto">
                View Schedule
              </Button>
            </div>

            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <Card
                  key={session.id}
                  className="overflow-hidden border-border hover:border-primary transition-colors"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-40 h-24">
                      <img
                        src={session.image}
                        alt={session.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{session.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/live/${session.id}`}>
                          <Button size="sm" variant="outline" className="gap-2">
                            <Play className="w-3 h-3" />
                            Join Live
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Active Subscriptions */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Active Subscriptions</h2>
            <div className="space-y-4">
              {activeSubscriptions.map((trainer) => (
                <Card key={trainer.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-border">
                        <img
                          src={trainer.photo}
                          alt={trainer.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{trainer.name}</h4>
                        <p className="text-[10px] text-primary">
                          {trainer.specialization}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-xs text-yellow-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{trainer.rating}</span>
                      </div>
                      <p className="text-xs font-bold text-muted-foreground">
                        Renews on July 5, 2026
                      </p>
                    </div>
                    <Link to={`/trainer/${trainer.id}`}>
                      <Button size="sm" className="w-full" variant="secondary">
                        View Profile
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
