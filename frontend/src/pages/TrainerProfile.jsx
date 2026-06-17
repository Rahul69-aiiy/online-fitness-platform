import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { TRAINERS, SESSIONS, REVIEWS } from "@/mocks/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Star,
  Users,
  CheckCircle2,
  MapPin,
  Calendar,
  MessageSquare,
} from "lucide-react";

export default function TrainerProfile() {
  const { id } = useParams();
  const trainer = TRAINERS.find((t) => t.id === id);
  const trainerSessions = SESSIONS.filter((s) => s.trainerId === id);
  const trainerReviews = REVIEWS.filter((r) => r.trainerId === id);

  if (!trainer) return <div>Trainer not found</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-60 md:pt-0 flex justify-center items-center">
        {/* Cover Banner */}
        <div className="h-64 md:h-80 from-primary/3 pt-16">
          <div className="container mx-auto px-4 h-full flex items-end pb-8">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-end">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-background shadow-xl">
                <img
                  src={trainer.photo}
                  alt={trainer.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {trainer.name}
                </h1>
                <p className="text-primary font-medium mb-4">
                  {trainer.specialization}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-bold text-foreground">
                      {trainer.rating}
                    </span>
                    <span>({trainerReviews.length} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span className="font-bold text-foreground">
                      {trainer.studentCount}+
                    </span>
                    <span>Students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-bold text-foreground">
                      {trainer.experience}
                    </span>
                    <span>Experience</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mb-2 md:ml-[140px]">
                <Button size="lg" className="px-4 md:px-8">
                  Subscribe
                </Button>
                <Button size="lg" variant="outline" className="p-3">
                  <MessageSquare className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Info */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4">About Me</h2>
              <p className="text-muted-foreground leading-relaxed">
                {trainer.bio}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Certifications</h2>
              <div className="flex flex-wrap gap-2">
                {trainer.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="px-3 py-1 bg-secondary rounded-full text-sm font-medium"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Upcoming Sessions</h2>
              <div className="space-y-4">
                {trainerSessions.map((session) => (
                  <Card
                    key={session.id}
                    className="overflow-hidden border-border hover:border-primary transition-colors"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-48 h-32">
                        <img
                          src={session.image}
                          alt={session.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-lg mb-1">
                            {session.title}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {session.date} • {session.time}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {session.type} ({session.location})
                              </span>
                            </div>
                          </div>
                        </div>
                        <Link to={`/session/${session.id}`}>
                          <Button>Book Slot</Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Reviews</h2>
              <div className="space-y-6">
                {trainerReviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold">{review.userName}</h4>
                      <div className="flex items-center gap-1 text-yellow-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-3 h-3",
                              i < review.rating ? "fill-current" : "text-muted",
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">
                      {review.comment}
                    </p>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                      {review.date}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Pricing & Locations */}
          <div className="space-y-8">
            <Card className="bg-card border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle>Subscription Plans</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    name: "Monthly",
                    price: trainer.monthlyPrice,
                    period: "mo",
                  },
                  {
                    name: "Quarterly",
                    price: trainer.monthlyPrice * 2.5,
                    period: "3mo",
                    discount: "15% OFF",
                  },
                  {
                    name: "Annual",
                    price: trainer.monthlyPrice * 8,
                    period: "yr",
                    discount: "33% OFF",
                  },
                ].map((plan) => (
                  <div
                    key={plan.name}
                    className="p-4 rounded-xl border border-border hover:border-primary transition-colors group cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold">{plan.name}</p>
                        {plan.discount && (
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {plan.discount}
                          </span>
                        )}
                      </div>
                      <p className="text-xl font-bold">
                        ${plan.price.toFixed(0)}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Full access to all live and recorded sessions.
                    </p>
                  </div>
                ))}
                <Button className="w-full py-6 mt-4">Subscribe Now</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Training Locations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {trainer.locations.map((loc, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{loc.gymName}</h4>
                      <p className="text-xs text-muted-foreground">
                        {loc.address}, {loc.city}
                      </p>
                      <p className="text-[10px] text-primary mt-1 font-medium">
                        {loc.availability}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
