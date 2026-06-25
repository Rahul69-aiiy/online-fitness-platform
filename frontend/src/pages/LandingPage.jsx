import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CATEGORIES } from "@/data/constants";
import useTrainersQuery from "@/hooks/useTrainersQuery";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Users, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import hero from "@/assets/hero.jpg"

export default function LandingPage() {

  const location = useLocation();
  const { data, isLoading } = useTrainersQuery();
  const trainers = data?.data?.slice(0, 3) || [];

  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);

      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={hero} 
            alt="Gym" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6">
              TRANSFORM <br />
              YOUR <span className="text-primary italic">BODY</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10">
              ELEVATE YOUR LIFE
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/trainers">
                <Button size="lg" className="px-10 py-7 text-lg font-bold">
                  FIND TRAINERS
                </Button>
              </Link>
              <Link to="/register?role=trainer">
                <Button size="lg" variant="outline" className="px-10 py-7 text-lg font-bold">
                  BECOME A TRAINER
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Trainers */}
      <section className="py-8 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-7 gap-6">
            <div>
              <h2 className="text-3xl font-bold mb-1">Featured Trainers</h2>
              <p className="text-muted-foreground">Learn from the best in the industry.</p>
            </div>
            <Link to="/trainers" className="md:mt-5">
              <Button variant="link" className="text-primary p-0 h-auto">View All Trainers →</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="aspect-square bg-card border border-border animate-pulse rounded-2xl h-80" />
              ))
            ) : (
              trainers.map((trainer, index) => {
                const trainerName = trainer.user?.name || trainer.name;
                const trainerAvatar = trainer.user?.avatar || "/user.jpg";
                const trainerPrice = trainer.plans?.[0]?.price || "–";
                return (
                  <motion.div
                    key={trainer.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="overflow-hidden border-border hover:border-primary transition-colors group">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={trainerAvatar} 
                          alt={trainerName} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold">{trainerName}</h3>
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-bold">{trainer.rating?.toFixed(1) || "5.0"}</span>
                          </div>
                        </div>
                        <p className="text-sm text-primary font-medium mb-4">{trainer.specialization}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{trainer.studentCount}+ Students</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{trainer.experience} yrs Exp</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-bold">₹{Number(trainerPrice).toLocaleString("en-IN")}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                          <Link to={`/trainer/${trainer.id}`}>
                            <Button size="sm">View Profile</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-24" id="categories">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((category) => (
              <Link 
                key={category} 
                to={`/trainers?category=${category}`}
                className="group relative h-40 rounded-xl overflow-hidden flex items-center justify-center border border-border hover:border-primary transition-colors"
              >
                <div className="absolute inset-0 bg-primary/1 group-hover:bg-primary/3 transition-colors" />
                <span className="relative z-10 text-lg font-bold">{category}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-card/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Find your trainer", desc: "Browse our elite selection of certified fitness professionals." },
              { title: "Choose a plan", desc: "Select a subscription that fits your lifestyle and goals." },
              { title: "Start training", desc: "Attend live sessions or watch recordings anytime, anywhere." }
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-primary/1 rounded-full flex items-center justify-center mb-6 text-primary font-bold text-2xl border border-primary/20">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
