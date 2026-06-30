import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Star,
  Users,
  CheckCircle2,
  MessageSquare,
  MapPin,
} from "lucide-react";
import ReviewCard from "@/components/ui/ReviewCard";
import useAuthStore from "@/store/useAuthStore";
import useTrainerDetailQuery from "@/hooks/useTrainerDetailQuery";
import {
  useReviewsQuery,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
} from "@/hooks/useReviewsQuery";
import { useMySubscriptions } from "@/hooks/useSubscriptionQuery";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Spinner from "@/components/ui/Spinner";

export default function TrainerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: trainer, isLoading: trainerLoading } = useTrainerDetailQuery(id);
  const { data: reviews = [], isLoading: reviewsLoading } = useReviewsQuery(id);
  
  const createReviewMutation = useCreateReview();
  const updateReviewMutation = useUpdateReview(id);
  const deleteReviewMutation = useDeleteReview(id);

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const isOwnProfile = user?.id === trainer?.userId;
  const isStudent = user?.role === "STUDENT";

  const { data: subscriptions = [] } = useMySubscriptions({
    enabled: isAuthenticated && isStudent,
  });

  const isSubscribed = subscriptions.some(
    (sub) =>
      sub.trainerId === id &&
      sub.isActive &&
      new Date(sub.endDate) > new Date()
  );

  // New review form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  const handleUpdate = async (reviewId, data) => {
    updateReviewMutation.mutate({ reviewId, ...data });
  };

  const handleDelete = async (reviewId) => {
    deleteReviewMutation.mutate(reviewId);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate("/login"); return; }
    createReviewMutation.mutate(
      { trainerId: id, rating: newRating, comment: newComment },
      {
        onSuccess: () => {
          setNewComment("");
          setNewRating(5);
        },
      }
    );
  };

  if (trainerLoading) {
    return <LoadingScreen message="Loading trainer profile..." />;
  }


  if (!trainer) return <div className="min-h-screen bg-background text-foreground flex items-center justify-center text-muted-foreground">Trainer not found</div>;

  const trainerName = trainer.user?.name || trainer.name || "Trainer";
  const trainerPhoto = trainer.user?.avatar || trainer.photo || "/user.jpg";
  const monthlyPrice = trainer.plans?.[0]?.price || trainer.monthlyPrice || 0;
  const certifications = trainer.certifications || [];
  const locations = trainer.locations || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-60 md:pt-0 flex justify-center items-center">
        {/* Cover Banner */}
        <div className="h-64 md:h-80 from-primary/3 pt-16">
          <div className="container mx-auto px-4 h-full flex items-end pb-8">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-end">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-4 border-background shadow-xl">
                {trainerPhoto && (
                  <img
                    src={trainerPhoto}
                    alt={trainerName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {trainerName}
                </h1>
                <p className="text-primary font-medium mb-4">
                  {trainer.specialization}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-bold text-foreground">
                      {trainer.rating?.toFixed(1) || "N/A"}
                    </span>
                    <span>({reviews.length} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span className="font-bold text-foreground">
                      {trainer.studentCount || 0}+
                    </span>
                    <span>Students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-bold text-foreground">
                      {trainer.experience}
                    </span>
                    <span>yrs Experience</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mb-2 md:ml-[140px] items-center">
                {isAuthenticated ? (
                  <>
                    {!isOwnProfile && isStudent && (
                      <>
                        {!isSubscribed ? (
                          <Link to={`/checkout?trainer=${trainer.id}`}>
                            <Button size="lg" className="px-4 md:px-8">
                              Subscribe
                            </Button>
                          </Link>
                        ) : (
                          <>
                            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-500 text-sm font-medium border border-emerald-500/20">
                              <CheckCircle2 className="w-4 h-4" /> Active Subscriber
                            </span>
                            <Link to={`/messages?to=${trainer.userId || trainer.id}`}>
                              <Button size="lg" variant="outline" className="p-3">
                                <MessageSquare className="w-5 h-5" />
                              </Button>
                            </Link>
                          </>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <Link to={`/checkout?trainer=${trainer.id}`}>
                    <Button size="lg" className="px-4 md:px-8">
                      Subscribe
                    </Button>
                  </Link>
                )}
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
                {trainer.bio || "No bio provided."}
              </p>
            </section>

            {certifications.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4">Certifications</h2>
                <div className="flex flex-wrap gap-2">
                  {certifications.map((cert) => (
                    <span
                      key={cert}
                      className="px-3 py-1 bg-secondary rounded-full text-sm font-medium"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-bold mb-6">Reviews</h2>
              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                {reviewsLoading && (
                  <div className="flex items-center justify-center h-20">
                    <Spinner size="md" />
                  </div>
                )}
                {!reviewsLoading && reviews.length === 0 && (
                  <p className="text-muted-foreground">No reviews yet. Be the first!</p>
                )}
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    currentUserId={user?.id}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {/* Add review form */}
              {isAuthenticated && user?.role === "STUDENT" && (
                <form onSubmit={handleSubmitReview} className="mt-8 p-6 bg-card border border-border rounded-2xl space-y-4">
                  <h3 className="font-bold text-lg">Leave a Review</h3>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className={cn(
                          "text-2xl transition-colors",
                          star <= newRating ? "text-yellow-500" : "text-muted"
                        )}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Write your review..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-sm resize-none"
                    required
                  />
                  <Button type="submit" disabled={createReviewMutation.isPending}>
                    {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                  </Button>
                </form>
              )}
            </section>
          </div>

          {/* Right Column: Pricing & Locations */}
          <div className="space-y-8">
            <Card className="bg-card border-primary/20 shadow-lg">
              <CardHeader>
                <CardTitle>Subscription Plans</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(trainer.plans?.length > 0
                  ? trainer.plans
                  : [
                      { name: "Monthly", price: monthlyPrice, period: "mo" },
                      { name: "Quarterly", price: monthlyPrice * 2.5, period: "3mo", discount: "15% OFF" },
                      { name: "Annual", price: monthlyPrice * 8, period: "yr", discount: "33% OFF" },
                    ]
                ).map((plan) => {
                  const content = (
                    <div
                      className={cn(
                        "p-4 rounded-xl border border-border hover:border-primary transition-colors cursor-pointer",
                        isSubscribed && "opacity-60 cursor-not-allowed hover:border-border"
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold">{plan.name}</p>
                          {plan.discount && (
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              {plan.discount}
                            </span>
                          )}
                          {plan.description && (
                            <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">
                            ₹{Number(plan.price).toLocaleString("en-IN")}
                          </p>
                          {plan.durationDays && (
                            <p className="text-xs text-muted-foreground">{plan.durationDays} days</p>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Full access to all live and recorded sessions.
                      </p>
                    </div>
                  );

                  return isSubscribed || (isAuthenticated && !isStudent) ? (
                    <div key={plan.id || plan.name}>{content}</div>
                  ) : (
                    <Link
                      to={plan.id ? `/checkout?trainer=${trainer.id}&plan=${plan.id}` : `/checkout?trainer=${trainer.id}`}
                      key={plan.id || plan.name}
                    >
                      {content}
                    </Link>
                  );
                })}
                {!isAuthenticated || isStudent ? (
                  !isSubscribed ? (
                    <Link to={`/checkout?trainer=${trainer.id}`}>
                      <Button className="w-full py-6 mt-4">Subscribe Now</Button>
                    </Link>
                  ) : (
                    <Button disabled className="w-full py-6 mt-4 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 cursor-not-allowed">
                      Already Subscribed
                    </Button>
                  )
                ) : null}
              </CardContent>
            </Card>

            {locations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Training Locations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {locations.map((loc, i) => (
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
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
