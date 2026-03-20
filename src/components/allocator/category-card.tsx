"use client";

import { useState } from "react";
import * as LucideIcons from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { TOTAL_SPENDING_BILLIONS } from "@/lib/data/budget-categories";
import { CategoryInfoPopover } from "./category-info-popover";
import { CATEGORY_DETAILS } from "@/lib/data/category-details";

interface CategoryCardProps {
  name: string;
  description: string;
  slug: string;
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
  slug,
  icon,
  actualPercentage,
  actualAmountBillions,
  funFact,
  userPercentage,
  onPercentageChange,
  remaining,
}: CategoryCardProps) {
  const [showFact, setShowFact] = useState(false);

  const iconName = icon
    ? (icon
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("") as keyof typeof LucideIcons)
    : null;

  const IconComponent =
    iconName && iconName in LucideIcons
      ? (LucideIcons[iconName] as React.ComponentType<{ className?: string }>)
      : null;

  const userAmountBillions =
    (userPercentage / 100) * TOTAL_SPENDING_BILLIONS;
  const maxAllowed = userPercentage + remaining;
  const diff = userPercentage - actualPercentage;
  const detail = CATEGORY_DETAILS[slug];

  return (
    <div className="bg-white border border-gov-well-border p-3 hover:border-gov-navy/30 transition-colors duration-200 flex flex-col h-full">
      {/* Header: icon + name + actual */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-gov-navy/10 flex items-center justify-center shrink-0">
          {IconComponent ? (
            <IconComponent className="w-4 h-4 text-gov-navy" />
          ) : (
            <div className="w-4 h-4 bg-gov-navy/30" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold text-gov-text leading-tight truncate">
              {name}
            </h3>
            {detail && (
              <CategoryInfoPopover detail={detail} categoryName={name} />
            )}
          </div>
          <div className="text-xs text-gov-text/50">
            Gov: {actualPercentage}% · {formatCurrency(actualAmountBillions)}
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="flex-1 flex flex-col justify-end">
        <input
          type="range"
          min={0}
          max={Math.min(100, maxAllowed)}
          step={0.5}
          value={userPercentage}
          onChange={(e) => onPercentageChange(parseFloat(e.target.value))}
          className="budget-slider"
          style={{
            "--fill-percent": `${maxAllowed > 0 ? (userPercentage / Math.min(100, maxAllowed)) * 100 : 0}%`,
          } as React.CSSProperties}
        />

        {/* Values row */}
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-base font-bold text-people-blue leading-none">
            {userPercentage.toFixed(1)}%
          </span>
          {userPercentage > 0 && (
            <span
              className={`text-xs font-semibold leading-none ${
                diff > 0
                  ? "text-diff-positive"
                  : diff < 0
                  ? "text-diff-negative"
                  : "text-gov-text/50"
              }`}
            >
              {diff > 0 ? "+" : ""}
              {diff.toFixed(1)}
            </span>
          )}
          <span className="text-xs text-gov-text/40 leading-none">
            {formatCurrency(userAmountBillions)}
          </span>
        </div>

        {/* Mini comparison bars */}
        <div className="relative mt-1.5 h-2.5">
          <div
            className="absolute top-0 left-0 h-1 bg-people-blue transition-all duration-200"
            style={{ width: `${Math.min(userPercentage * 2.5, 100)}%` }}
          />
          <div
            className="absolute top-1.5 left-0 h-1 bg-gov-red/40"
            style={{ width: `${Math.min(actualPercentage * 2.5, 100)}%` }}
          />
        </div>
      </div>

      {/* Fun fact toggle */}
      {funFact && (
        <div className="mt-1.5 border-t border-gov-well-border pt-1.5">
          <button
            onClick={() => setShowFact(!showFact)}
            className="text-[11px] text-gov-link hover:text-gov-link-hover cursor-pointer no-underline"
          >
            {showFact ? "Hide" : "Did you know?"}
          </button>
          {showFact && (
            <p className="text-xs text-gov-text/70 mt-1 leading-snug italic">
              {funFact}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
