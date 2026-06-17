import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Navbar() {

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/50 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <span className="text-xl font-bold tracking-tight">FitLive</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/trainers" className="hover:text-primary transition-colors">Find Trainers</Link>
          <Link to="/#categories" className="hover:text-primary transition-colors">Categories</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/register?role=student">
            <Button>Join Now</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
