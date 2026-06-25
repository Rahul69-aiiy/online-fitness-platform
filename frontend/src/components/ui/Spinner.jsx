import { cn } from "@/lib/utils";

export default function Spinner({ className, size = "md" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-t-primary border-r-transparent border-b-transparent border-l-transparent",
        "border-solid border-muted-foreground/20",
        sizeClasses[size],
        className
      )}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
