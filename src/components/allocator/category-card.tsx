"use client";

import { useState } from "react";
import * as LucideIcons from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { TOTAL_SPENDING_BILLIONS } from "@/lib/data/budget-categories";

interface CategoryCardProps {
  name: string;
  description: string;
  icon: string | null;
  actualPercentage: number;
  actualAmountBillions: number;
  funFact: string | null;
  userPercentage: number;
  onPercentageChange: (value: number) => void;
  remaining: number;
}

export function CategoryCard({
  name,
  description,
  icon,
  actualPercentage,
  actualAmountBillions,
  funFact,
  userPercentage,
  onPercentageChange,
  remaining,
}: CategoryCardProps) {
  const [showFact, setShowFact] = useState(false);

  // Dynamic icon lookup
  const iconName = icon
    ? (icon
        .split("-")
        .map((part, i) =>
          i === 0
            ? part.charAt(0).toUpperCase() + part.slice(1)
            : part.charAt(0).toUpperCase() + part.slice(1)
        )
        .join("") as keyof typeof LucideIcons)
    : null;

  const IconComponent =
    iconName && iconName in LucideIcons
      ? (LucideIcons[iconName] as React.ComponentType<{ className?: string }>)
      : null;

  const userAmountBillions =
    (userPercentage / 100) * TOTAL_SPENDING_BILLIONS;

  const maxAllowed = userPercentage + remaining;

  return (
    <div className="gov-well mb-3">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-10 h-10 bg-gov-navy/10 flex items-center justify-center shrink-0 mt-0.5">
          {IconComponent ? (
            <IconComponent className="w-5 h-5 text-gov-navy" />
          ) : (
            <div className="w-5 h-5 bg-gov-navy/30 rounded-sm" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-gov-text leading-tight">
                {name}
              </h3>
              <p className="text-sm text-gov-text/70 mt-0.5">{description}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm text-gov-text/60">
                Actual: {actualPercentage}%
              </div>
              <div className="text-sm text-gov-text/60">
                {formatCurrency(actualAmountBillions)}
              </div>
            </div>
          </div>

          {/* Slider */}
          <div className="mt-3">
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={Math.min(100, maxAllowed)}
                step={0.5}
                value={userPercentage}
                onChange={(e) => onPercentageChange(parseFloat(e.target.value))}
                className="flex-1 h-2 appearance-none bg-gov-well-border rounded-sm cursor-pointer accent-people-blue"
              />
              <div className="w-20 text-right">
                <span className="text-lg font-bold text-people-blue">
                  {userPercentage.toFixed(1)}%
                </span>
              </div>
            </div>
            {/* Mini comparison bar */}
            <div className="flex gap-1 mt-2 h-1.5">
              <div
                className="h-full bg-people-blue rounded-sm transition-all duration-200"
                style={{
                  width: `${Math.min(userPercentage, 100)}%`,
                }}
                title={`Your choice: ${userPercentage.toFixed(1)}%`}
              />
              <div
                className="h-full bg-gov-red/40 rounded-sm"
                style={{
                  width: `${actualPercentage}%`,
                  position: "absolute",
                  left: 0,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gov-text/50 mt-1">
              <span>
                You: {formatCurrency(userAmountBillions)}
              </span>
              <span>
                Gov: {formatCurrency(actualAmountBillions)}
              </span>
            </div>
          </div>

          {/* Fun fact */}
          {funFact && (
            <div className="mt-2">
              <button
                onClick={() => setShowFact(!showFact)}
                className="text-xs text-gov-link hover:text-gov-link-hover cursor-pointer no-underline"
              >
                {showFact ? "Hide fact" : "Did you know?"}
              </button>
              {showFact && (
                <p className="text-sm text-gov-text/80 mt-1 pl-3 border-l-2 border-gov-red/30 italic">
                  {funFact}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
