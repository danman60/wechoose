import { cn } from "@/lib/utils";

interface PercentageBarProps {
  percentage: number;
  color: string;
  label?: string;
  showValue?: boolean;
  className?: string;
  animate?: boolean;
}

export function PercentageBar({
  percentage,
  color,
  label,
  showValue = true,
  className,
  animate = false,
}: PercentageBarProps) {
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gov-text">{label}</span>
          {showValue && (
            <span className="text-sm font-semibold text-gov-text">
              {percentage.toFixed(1)}%
            </span>
          )}
        </div>
      )}
      <div className="w-full h-3 bg-gov-well rounded-sm overflow-hidden">
        <div
          className={cn(
            "h-full rounded-sm",
            animate && "transition-all duration-500 ease-out"
          )}
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
