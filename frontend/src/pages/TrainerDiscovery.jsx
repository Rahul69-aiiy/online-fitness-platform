import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import { CATEGORIES } from "../data/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Users, CheckCircle2, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import useTrainersQuery from "@/hooks/useTrainersQuery";

export default function TrainerDiscovery() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState(query || "All");
  const [rating, setRating] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (selectedCategory === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: selectedCategory });
    }
    setPage(1);
  }, [selectedCategory]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useTrainersQuery(
    { search: debouncedSearch, category: selectedCategory, rating },
    page
  );

  const trainers = data?.data || [];
  const pagination = data?.pagination;

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">Discover Trainers</h1>
            <p className="text-muted-foreground">
              Find the perfect coach for your fitness journey.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search trainers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-64"
              />
            </div>
            <select
              value={rating}
              onChange={(e) => {
                setRating(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm text-muted-foreground cursor-pointer"
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4+ Stars</option>
              <option value="3.0">3+ Stars</option>
            </select>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <Button variant="dummy" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          <Button
            variant={selectedCategory === "All" ? "default" : "outline"}
            onClick={() => setSelectedCategory("All")}
            className="rounded-full"
          >
            All
          </Button>
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-card border border-border animate-pulse h-72"
              />
            ))}
          </div>
        )}

        {/* Trainers Grid */}
        {!isLoading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {trainers.map((trainer) => (
                <Card
                  key={trainer.id}
                  className="overflow-hidden border-border hover:border-primary transition-colors group"
                >
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={trainer.user?.avatar || trainer.photo || "/user.jpg"}
                      alt={trainer.user?.name || trainer.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 text-yellow-500">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs font-bold">{trainer.rating?.toFixed(1)}</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold mb-1">{trainer.user?.name || trainer.name}</h3>
                    <p className="text-xs text-primary font-medium mb-3">
                      {trainer.specialization}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="w-3 h-3" />
                        <span>{trainer.studentCount}+ Students</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{trainer.experience} yrs experience</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <p className="font-bold">
                        ₹{trainer.plans?.[0]?.price || "–"}
                        <span className="text-[10px] font-normal text-muted-foreground">
                          /mo
                        </span>
                      </p>
                      <div className="flex gap-2">
                        <Link to={`/trainer/${trainer.id}`}>
                          <Button size="sm" variant="outline">
                            Profile
                          </Button>
                        </Link>
                        <Link to={`/checkout?trainer=${trainer.id}`}>
                          <Button size="sm">Subscribe</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {trainers.length === 0 && (
              <div className="text-center py-24">
                <p className="text-xl text-muted-foreground">
                  No trainers found matching your criteria.
                </p>
                <Button
                  variant="link"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("All");
                    setRating("");
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="w-9 h-9 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: pagination.totalPages }).map((_, i) => (
                  <Button
                    key={i}
                    size="sm"
                    variant={pagination.page === i + 1 ? "default" : "outline"}
                    onClick={() => handlePageChange(i + 1)}
                    className="w-9 h-9"
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="w-9 h-9 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
