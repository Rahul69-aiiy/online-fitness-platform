import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function AuthLayout({ children, title, description, image }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side: Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 lg:p-24 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <Link to="/" className="inline-flex items-center gap-2 mb-8">
              <img src="/favicon.svg" alt="physiq logo" className="w-10 h-10" />
              <span className="text-2xl font-bold tracking-tight">PhysiQ</span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground mt-2">{description}</p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </div>
      </div>

      {/* Right Side: Image */}
      <div className="hidden md:block flex-1 relative overflow-hidden">
        <img 
          src={image || "/auth1.jpg"} 
          alt="Fitness" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <blockquote className="text-2xl font-bold italic">
            "The only bad workout is the one that didn't happen."
          </blockquote>
          <p className="mt-4 text-lg">— PhysiQ Community</p>
        </div>
      </div>
    </div>
  );
}
