import { motion } from "framer-motion";
import Spinner from "./Spinner";

export default function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a] text-white">
      {/* Background Pulse Glow */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-primary/5 blur-[80px] animate-pulse pointer-events-none" />

      <div className="relative flex flex-col items-center max-w-sm text-center px-6">
        {/* Animated Brand Logo Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="relative mb-8"
        >
          {/* Outer glowing halo */}
          <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-md animate-ping duration-1000" />
          
          <div className="relative w-16 h-16 bg-card border border-border rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden">
            <img src="/favicon.svg" alt="PhysiQ Logo" className="w-10 h-10 object-contain" />
          </div>
        </motion.div>

        {/* Themed Spinner */}
        <div className="mb-4">
          <Spinner size="lg" className="border-t-primary" />
        </div>

        {/* Loading Message */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-muted-foreground text-sm font-medium tracking-wide animate-pulse"
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
}
