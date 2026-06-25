import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import useToastStore from "@/store/useToastStore";

export default function ToastProvider() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-primary shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
  };

  const borders = {
    success: "border-emerald-500/20",
    error: "border-primary/20",
    info: "border-blue-400/20",
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
            className={`pointer-events-auto relative flex gap-3 p-4 rounded-xl border bg-[#121212]/90 backdrop-blur-md shadow-2xl glass ${borders[toast.type]}`}
          >
            {icons[toast.type]}
            
            <div className="flex-1 text-sm font-medium text-white/90">
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-muted-foreground hover:text-white transition-colors shrink-0 self-start"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Progress Bar */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: toast.duration / 1000, ease: "linear" }}
              className={`absolute bottom-0 left-0 h-0.5 rounded-b-xl ${
                toast.type === "success"
                  ? "bg-emerald-500"
                  : toast.type === "error"
                  ? "bg-primary"
                  : "bg-blue-400"
              }`}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
