"use client";

import { BUDGET_CATEGORIES } from "@/lib/data/budget-categories";
import { formatCurrency } from "@/lib/utils";

interface ComparisonChartProps {
  userAllocations: Record<string, number> | null;
  peopleAggregates: Record<string, number>;
  totalAllocations: number;
}

export function ComparisonChart({
  userAllocations,
  peopleAggregates,
  totalAllocations,
}: ComparisonChartProps) {
  // Find the max value for scaling bars
  const maxPct = Math.max(
    ...BUDGET_CATEGORIES.map((cat) => {
      const govPct = cat.actual_percentage;
      const peoplePct = peopleAggregates[cat.slug] ?? 0;
      const userPct = userAllocations?.[cat.slug] ?? 0;
      return Math.max(govPct, peoplePct, userPct);
    }),
    1
  );
  const scale = 100 / maxPct;

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6">
        {userAllocations && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-people-blue" />
            <span className="text-sm text-gov-text">Your Budget</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#8B5CF6]" />
          <span className="text-sm text-gov-text">
            The People ({totalAllocations.toLocaleString()} voices)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gov-red" />
          <span className="text-sm text-gov-text">Government Actual</span>
        </div>
      </div>

      {/* Category rows */}
      {BUDGET_CATEGORIES.map((cat, index) => {
        const govPct = cat.actual_percentage;
        const peoplePct = peopleAggregates[cat.slug] ?? 0;
        const userPct = userAllocations?.[cat.slug] ?? null;
        const diff = peoplePct - govPct;

        return (
          <div
            key={cat.slug}
            className="bg-white border border-gov-well-border p-4 hover:border-gov-navy/30 transition-all duration-200"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-base font-bold text-gov-text">
                  {cat.name}
                </h4>
                <span className="text-xs text-gov-text/50">
                  {formatCurrency(cat.actual_amount_billions)}
                </span>
              </div>
              {totalAllocations > 0 && (
                <div
                  className={`text-sm font-bold px-2 py-0.5 ${
                    diff > 0.5
                      ? "text-diff-positive bg-diff-positive/10"
                      : diff < -0.5
                      ? "text-diff-negative bg-diff-negative/10"
                      : "text-gov-text/50"
                  }`}
                >
                  {diff > 0 ? "+" : ""}
                  {diff.toFixed(1)}%
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              {/* User bar */}
              {userPct !== null && userPct > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gov-text/60 w-16 shrink-0">
                    You
                  </span>
                  <div className="flex-1 h-5 bg-gov-well-border/30 overflow-hidden">
                    <div
                      className="h-full bg-people-blue transition-all duration-700 ease-out"
                      style={{ width: `${userPct * scale}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-people-blue w-12 text-right">
                    {userPct.toFixed(1)}%
                  </span>
                </div>
              )}

              {/* People bar */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gov-text/60 w-16 shrink-0">
                  People
                </span>
                <div className="flex-1 h-5 bg-gov-well-border/30 overflow-hidden">
                  <div
                    className="h-full bg-[#8B5CF6] transition-all duration-700 ease-out"
                    style={{ width: `${peoplePct * scale}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-[#8B5CF6] w-12 text-right">
                  {peoplePct > 0 ? peoplePct.toFixed(1) + "%" : "\u2014"}
                </span>
              </div>

              {/* Government bar */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gov-text/60 w-16 shrink-0">
                  Gov&apos;t
                </span>
                <div className="flex-1 h-5 bg-gov-well-border/30 overflow-hidden">
                  <div
                    className="h-full bg-gov-red transition-all duration-700 ease-out"
                    style={{ width: `${govPct * scale}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-gov-red w-12 text-right">
                  {govPct.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
