import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";

const LogoSpinner = ({ size = 56, className }) => {
  const boxSize = typeof size === "number" ? `${size}px` : size;
  const iconSize = typeof size === "number" ? Math.max(20, Math.round(size * 0.6)) : 32;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        className,
      )}
      style={{ width: boxSize, height: boxSize }}
      aria-label="Loading"
      role="status"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-500 shadow-xl animate-spin" />
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" />
      <Scale className="relative text-white" style={{ width: iconSize, height: iconSize }} />
    </div>
  );
};

export default LogoSpinner;
